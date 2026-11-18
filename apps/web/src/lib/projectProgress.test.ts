import { describe, expect, it } from "vitest";
import { PROJECT_GATES, projectGateProgress } from "./projectProgress";

describe("project milestone progress", () => {
  it("counts only independently verified gates instead of activity or PR creation", () => {
    const result = projectGateProgress(PROJECT_GATES);
    expect(result).toEqual({ verified: 1, total: 10, percent: 10, inProgress: 2, blocked: 3, planned: 4 });
    expect(PROJECT_GATES.find(g => g.id === "visual-integrity")?.status).toBe("in_progress");
    expect(PROJECT_GATES.find(g => g.id === "release")?.status).toBe("blocked");
  });
  it("never counts blocked or in-progress work as complete", () => {
    const summary = projectGateProgress([
      {id:"a",status:"verified",title:"ok",evidence:"",next:""},
      {id:"b",status:"in_progress",title:"wip",evidence:"",next:""},
      {id:"c",status:"blocked",title:"hold",evidence:"",next:""},
    ]);
    expect(summary.percent).toBe(33);
    expect(summary.verified).toBe(1);
  });
  it("rejects empty or duplicate milestone definitions", () => {
    expect(() => projectGateProgress([])).toThrow("invalid_project_gates");
    expect(() => projectGateProgress([PROJECT_GATES[0], PROJECT_GATES[0]])).toThrow("invalid_project_gates");
  });
});
