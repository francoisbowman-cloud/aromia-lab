# Texto extraído del post "All My Claude Skills for Better Prompting"

- Autor: @joeysnoisygroup (Higgsfield) · publicado 2026-09-24 · actualizado 2026-11
- URL: https://higgsfield.ai/@joeysnoisygroup/blogs/all-my-claude-skills-for-better-prompting
- AVISO: el cuerpo del post venía en un archivo binario de editor (ver `raw/post-body.bin`).
  Este texto es una extracción **con pérdida**: faltan caracteres sueltos y hay ruido de
  estructura. Sirve para entender el contenido, no como cita literal. La fuente fiable de
  cada skill es su propio `SKILL.md` en `skills/`.
- Instalación según el post: descargar cada zip, NO descomprimir, Claude → Settings →
  Customize → Skills → "Yours" → subir el .zip → activar el skill.

---

link(
w+https://www.youtube.com/watch?v=5dWgZDka3Ww(
w
noreferrer(
text(
one of my videos
text(
 D, thanks for being here! If you didn't, the short version is that I'
been building AI films for a
, and everything I make runs through a set of Claude skills I've written, broken, rewritten, and rebuilt more times than I can count. Today I'm giving you all 
. Some of them you have already downloaded but I've updated them and given them a new name. You'll see which ones are new and which ones have been renamed.
	full-time
	filmmaker
real
world
bout 6 
month
of them for free
	your cast
film
sharing
link(
https://youtube.com/@noisygroup(
w
noreferrer(
text(
YouTube channel
text(
% for free to whoever is starting out.
	your LLM 
 Shoot me a DM on 
link(
w
noreferrer(
text(
	Instagram
text(
text(

 Previously "Banana Pro Director"
text(
 – now it
s own skill, Castkit builds reusable character reference images, photoreal or animated, for Nano Banana Pro and other image models
. Every image renders on a flat 18% neutral gray background with shadowless light, so no lighting gets baked in and carried into later shots.
text(
 Previously "Banana Pro Director"
text(
 – now it
s own skill, Scenecraft writes photoreal environment and location images ("plates") for Nano Banana Pro, Seedream 5.0 Pro, or any other image model. It plans the composition silently first, then writes the prompt as five paragraphs of prose in a cinematographer's voice. Light is described by direction, quality, and temperature. Atmosphere fills the whole frame, with no fog.
 (Seedream, Chat-GPT
	UNDEFINED(
asset-embed(
file(
w$291d9c73-140b-43f1-b8ca-e7171dbb487f(
wnhttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/291d9c73-140b-43f1-b8ca-e7171dbb487f.md(
motiondojo-v1-SKILL.md(
file(
	UNDEFINED(
asset-embed(
file!
md files images 04.jpg(
image(
	UNDEFINED(
asset-embed(
file!
image(
	UNDEFINED(
asset-embed(
file!
file(
	UNDEFINED(
asset-embed(
file!
file(
	UNDEFINED(
asset-embed(
file!
md files images 05.jpg(
image(
	UNDEFINED(
asset-embed(
file(
w$8591fd13-7cdd-4153-a217-87ebbbe76ae7(
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/8591fd13-7cdd-4153-a217-87ebbbe76ae7.zip(
story-bible-builder.zip(
file(
heading(
text(
Voicesheet v1
Voice Consistency Prompt Engine
w	paragraph(
text(
Nov 
, 2026)
skill
	UNDEFINED(
asset-embed(
file!
w	paragraph(
w$767bc10b-6b2c-4293-bc18-1c714ba92919
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/767bc10b-6b2c-4293-bc18-1c714ba92919.jpg
md files images 08.jpg
image
	UNDEFINED(
asset-embed(
file!
w$2848509c-aab2-42b4-8a0a-fc22fc3795cc
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/2848509c-aab2-42b4-8a0a-fc22fc3795cc.zip
voicesheet-v1.zip
file
text(
What it does:
text(
text(
*Previously Joey's "Cinema Director Skill,"
text(
 Shotcaller writes production-grade Seedance 2.0 and 2.5 video prompts on a locked 16-slot structure. That structure covers the header, style, no-on-screen-text block, critical blocks, assets, geometry map, first frame, lens locks in FOV degrees, camera, light, atmosphere, timecoded action, physics, acting, audio, and locks. It handles action, choreography, product shots, performance, strobe, lipsync to an attached track, silent scenes, dialogue, and video extensions.
text(
What it does:
text(
3 Voicesheet walks you from nothing to a finished 
text(
video character reference
text(
: one short Seedance 2.5 clip that locks your character’s face, outfit, voice and the way they perform dialogue. The clip has two panels on a flat gray field. The left panel is a montage of full-body turns and tight inserts of the outfit details. The right panel is one unbroken close-up of the face, lipsyncing a phonetic pangram in the character’s own voice, with the head turning through the full emotional range. Save that clip as an Element, and every later generation knows how your character looks, sounds and emotes. There’s also an optional second prompt, a prop scale reference that locks the size of anything your character carries (a weapon, a bag, a phone), so it stops drifting from shot to shot.
w	paragraph(
w	paragraph(
text(
How it works:
text(
list(
listitem(
text(
Language and pangram.
text(
k First it asks what language your character speaks, because every language has its own sounds. It uses a 
text(
phonetic
text(
N pangram, which covers every sound the language makes, not just every letter.
 For 
e language, it builds one and shows you a coverage table of every sound and the word where it appears.
listitem(
text(
Personality and tags.
text(
 Next, give it two or three adjectives for who your character is: shy, cool, bratty, aggressive. It tags the pangram with ElevenLabs emotion tags across the full range (curious, playful, a laugh, a whisper, a gasp, a shout, a sigh), each one shaped to the personality. It also writes a voice design description you can paste into ElevenLabs.
listitem(
text(
Voice clip.
text(
M It walks you through generating the audio in ElevenLabs and downloading it.
listitem(
text(
Voice video.
text(
 Drop the audio on a black frame in any editor, set the length in whole seconds, and export at 720p. That file is your voice reference.
listitem(
text(
Character sheet.
text(
8 Use your own 3-panel sheet, or build one with Castkit 
first.
listitem(
text(
Character intake.
text(
Y It confirms the personality, the tagged pangram you actually used, and the clip length.
listitem(
text(
The reference prompt.
text(
 It hands off to Shotcaller to write the two-panel prompt, with every head turn and facial beat mapped to the voice tags so the face and the voice match.
w	paragraph(
text(

IMO: use 
text(
	Eleven v4
text(
 or whatever the newest tag-capable model is. Models without tag support read the brackets out loud or ignore them. Generate several takes and pick the one where every emotion actually lands, because regenerating is cheaper than settling. If you’re building a pangram for a language you don’t speak, have a native speaker read it once before it goes into the voice model.
w	paragraph(
text(
How to prompt it in your LLM:
list(
"
__listType
listitem(
text(
#8Say what language your character speaks and who they are
text(
#m in two or three adjectives, not their backstory. “Korean, cool and controlled, a little dry” is enough.
listitem(
text(
$ Tell it where you’re starting.
text(
$e If you already have a voice clip or a character sheet, say so and it skips ahead to the next stage.
listitem(
text(
%,Give it the exact length of your voice video
text(
%I in whole seconds. Every timing in the prompt is built from that number.
listitem(
text(
Tell it your reference tags.
text(
 Say whether you’re using Element handles or want plain @imageN tags, and upload your character sheet so it can read every garment and detail.
listitem(
text(
For a prop scale reference,
text(
 attach an image of the item, give its real size, and say how your character carries it: one hand, two hands, slung, holstered.
listitem(
text(
Once the render is done,
text(
)O save it as an Element in Higgsfield. From then on, tell Shotcaller it’s a 
text(
video character reference sheet
text(
*P whenever you tag it, and it’ll lock look, voice and performance all at once.
w	paragraph(
text(
Example asks:
text(
 “Build a voicesheet for my character. She speaks Korean, she’s bratty and chaotic.” Or: “I already have my voice clip, it’s 12 seconds, here’s my character sheet.” Or: “Make a pangram for a Spanish-speaking character.” Or: “Prop scale reference for her katana, 100cm, held in two hands.”
this process runs in sta
 for the best re
sults.
every
(skill
below)
w$d8a7d48b-a967-4284-a511-5e55332360c4
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/d8a7d48b-a967-4284-a511-5e55332360c4.jpg
md files images 03.jpg
ast updated Nov 9, 2026
w$b28d1605-0ab7-4e42-b3a4-e477969ba044
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/b28d1605-0ab7-4e42-b3a4-e477969ba044.jpg
md files images 07.jpg
w$dd0957a5-70f4-436d-ae71-2e235f6119b8
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/dd0957a5-70f4-436d-ae71-2e235f6119b8.zip
shotcaller-v2.zip
Prompt Engine
Plate Prompt Engine
Prompt Engine 
w$cd123e49-0a65-4979-afee-fabca194cafc
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/cd123e49-0a65-4979-afee-fabca194cafc.zip
scenecraft-v1.zip
w$68aa4dc8-7d9f-48cf-afc0-19c10512b15a
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/68aa4dc8-7d9f-48cf-afc0-19c10512b15a.zip
castkit-v1.zip
heading(
text(
HOW TO INSTALL THESE SKILLS
mdListMarker
list(
listitem(
text(
Download each 
zip file to your local computer
listitem(
text(
Do not extract
listitem(
text(
Open

'Settings'
aude
listitem(
text(
Find
'Customize'
sidebar
listitem(
text(
Click
over
'Skills
make
sure
'Yours'
selected
listitem(
text(
Click
button
upload
entire
.zip
file
listitem(
text(
turn
skill
you'd
like
	UNDEFINED(
horizontalrule
heading(
text(
Shotcaller v
: Seedance Prompt Engine
November
updated
w	paragraph(
w	paragraph(
w%https://instagram.com/joeysnoisygroup
	UNDEFINED(
asset-embed(
file!
image(
	UNDEFINED(
asset-embed(
file!
file(
w	paragraph(
w	paragraph(
w	paragraph(
text(
How it works:
text(
 First it asks which Seedance version you're on, because that sets the limits. Version 2.0 allows 9 references and 15 seconds. Version 2.5 allows 50 references and 30 seconds. IMO: Seedance 2.5 has the best color and renderings, but you run into audio issues regardless of how you prompt (possibilities of background music). The best way to remove the background audio is through moises.ai I've found.
w	paragraph(
w	paragraph(
text(
Next it gives you a short pre-prompt check listing your references, scene, dialogue, camera, audio, and runtime. After you approve, it delivers three things: a numbered list of references in the order you attach them, a titled prompt with the runtime, and one code block you can paste. Once a prompt is approved, tweaks come back as the full revised prompt without another check. Anything longer than the version's runtime cap gets split into separate prompts.
w	paragraph(
w	paragraph(
text(
How to prompt it your LLM:
list(
+
__listType
listitem(
text(
Give the version up front, attach your references, and describe the scene in plain language: who's in it, where it happens, what happens, etc.
listitem(
text(
-iBe sure to mention up front if you're using element tags or you want it to just use numbered @imageN tags
listitem(
text(
For dialogue, paste the script with speaker labels. It will write every line word for word and assign it to the right speaker, with the delivery written separately.
listitem(
text(
/OFor lipsync, say the audio track is attached. It becomes the only audio source.
listitem(
text(
0FFor extensions, say "extend this clip" and describe what happens next.
w	paragraph(
text(
Example asks:
text(
 "Seedance 2.5, 12 seconds, two characters arguing in a kitchen, here's the script." Or: "Break this scene into shots." Or: "Lipsync performance shot, track attached."
heading(
	UNDEFINED(
asset-embed(
file!
3
__filename
md files images 02.jpg(
3
__fileKind
image(
	UNDEFINED(
horizontalrule
text(
Castkit v1: Character 
w	paragraph(
text(
What it does:
text(
w	paragraph(
list(
7
__listType
listitem(
text(
7
Face lock:
text(
73 creates the character's canonical chest-up image.
listitem(
text(
7
Additions:
text(
8` changes hair, adds piercings, tattoos, or scars, builds expression sets, or re-locks the face.
listitem(
text(
Outfit build:
text(
9n puts a look on the locked character as one full-body image, after you approve a text proposal of the outfit.
listitem(
text(
Outfit replacement:
text(
:` swaps your character onto an outfit that already exists on someone else, using two references.
listitem(
text(
Character sheet:
text(
 turns an approved outfit image into a sheet. The default is 3 panels (headless front, full rear, tight face), all shot straight on; 6 panels are available on request.
w	paragraph(
text(
<_It won't skip ahead: an outfit needs a locked face first, and a sheet needs an approved outfit.
w	paragraph(
list(
=
__listType
listitem(
text(
Say whether the character is photoreal or animated. For animated, describe the style in your own words. If you don't have one, it offers three: graphic realism, stylized 3D, or 2D hand-drawn.
listitem(
text(
To create a new character, describe the face and identity markers, or attach inspiration. For outfits, attach garment references.
listitem(
text(
Already have a photoreal character? Attach it and ask for the animated version. The face and proportions stay the same; only the rendering style changes.
w	paragraph(
text(
Example asks:
text(
 "Build me a new character: sharp jaw, bleached buzz cut, septum ring, photoreal." Or: "Put these three garments on my locked character." Or: "Make a character sheet from this approved outfit." Or: "Turn this photoreal character into graphic-realism animated."
w	paragraph(
text(
How it works:
text(
DP The skill is organized into five stations, and you move through them in order:
w	paragraph(
text(
How to prompt it:
heading(
text(
Scenecraft v
: Scene 
	UNDEFINED(
horizontalrule
w	paragraph(
text(
What it does:
text(
w	paragraph(
list(
I
__listType
listitem(
text(
A, Environment:
text(
J) an empty location. This is the default.
listitem(
text(
B, People in scene:
text(
JQ characters placed into a location, which also works as a first frame for video.
listitem(
text(
C, Coverage set:
text(
KG several angles of the same location that agree on geometry and light.
listitem(
text(
D, Plate edit:
text(
L= changes an existing image while protecting everything else.
w	paragraph(
text(
It adjusts the prompt for whichever model you name. For example, on Seedream it uses HEX colors and puts in-world text in quotes.
w	paragraph(
list(
N
__listType
listitem(
text(
NuName the model, describe the location, time of day, and mood, and attach any location, mood, or character references.
listitem(
text(
OLIt helps to say what each reference is for, like "this one is palette only."
listitem(
text(
POFor coverage, ask for reverse angles or "a wide and a medium of the same room."
listitem(
text(
P9For edits, attach the plate and say exactly what changes.
w	paragraph(
text(
Example asks:
text(
Q7bandoned subway platform at 3am, practical light only."
Or: "Put these two characters into this diner as a first frame." Or: "Change this plate from day to dusk, keep everything else."
w	paragraph(
text(
How it works:
text(
 There are four plate types:
w	paragraph(
text(
How to prompt it:
	UNDEFINED(
horizontalrule
heading(
text(
Motiondojo v1: 
Genjutsu
motion transfer
w	paragraph(
text(
What it does:
text(
 Motiondojo writes lean prompts for Higgsfield Genjutsu. It takes the movement from a reference video and puts it on new characters in a new world, with real gravity and bodyweight in every move.
w	paragraph(
list(
W
__listType
listitem(
text(
W
Body Copy:
text(
WJ your characters copy the exact motion, and the camera matches the video.
listitem(
text(
Camera Copy:
text(
X= only the video's camera path carries over into a new scene.
listitem(
text(
Body Copy, New Camera:
text(
YX the exact motion stays, with a rebuilt handheld camera that moves naturally around it.
w	paragraph(
text(
Every prompt opens with a hard mouth lock, which is one of three settings: mouths closed, the exact words spoken in the video, or mouths matching the video's movement. The motion video is attached separately and never tagged in the prompt. All other references use 
text(
<<<image_N>>>
text(
\F tags. There's no audio block, since Genjutsu doesn't generate sound.
w	paragraph(
list(
]
__listType
listitem(
text(
Attach 
]8motion video and your character and location references.
listitem(
text(
Say which form you want, in plain language if you like. "Same moves, same shot" means Body Copy. "Use that camera move on my scene" means Camera Copy. "Same dance, but make the camera feel alive" means Body Copy, New Camera.
listitem(
text(
_FTell it which character maps to which performer (left, center, right).
listitem(
text(
`:If anyone speaks in the video, paste the exact transcript.
w	paragraph(
text(
Example asks:
text(
 "Put these two characters into this dance video, left and right, same camera, rooftop at golden hour, no one talks." Or: "Take the camera move from this clip and use it on my alley scene."
w	paragraph(
text(
How it works:
text(
 It writes one of three forms:
w	paragraph(
text(
How to prompt it:
c
screenshot
your
	UNDEFINED(
horizontalrule
heading(
text(
c/Story Bible Builder: Canon document interviewer
w	paragraph(
text(
What it does:
text(
 Story Bible Builder interviews you about your story world and assembles everything into one dense SKILL.md file that you install as your own custom skill. From then on, every Claude session knows your world: premise, thesis, timeline, aesthetic eras, factions, locations, rules, characters, relationships, plot engines, and production rules. The character sections include voice, movement, and stillness descriptors that are ready to paste into prompts.
w	paragraph(
w	paragraph(
list(
l
__listType
listitem(
text(
lMSay "build me a story bible" and give it the working title and a rough pitch.
listitem(
text(
mnAnswer the interview honestly, including the parts you haven't figured out yet; it helps build those with you.
listitem(
text(
ntIf you only need part of it, say so. For example, "just lock my characters" jumps straight to the character section.
listitem(
text(
o>To update an existing bible, paste it in and say what changed.
w	paragraph(
text(
Example asks:
text(
pZ "Build a story bible for my sci-fi series, four main characters, I'll be using Seedance 
pr" Or: "I just want to lock my characters' voices and movement." Or: "Here's my existing bible, add a new faction."
w	paragraph(
text(
How it works:
text(
 It starts with a quick scope check covering title, number of characters, genre, how much already exists, and which tools you'll use. Then it walks through the world section by section, with characters as the biggest section. The finished bible works two ways. It can stand alone for writing, lyrics, and image prompts. Or it can sit next to a video director like Shotcaller and feed it voice, movement, era, and locked visual traits that a reference image can't carry.
w	paragraph(
text(
How to prompt it:
w	paragraph(
w	paragraph(
w	paragraph(
w	paragraph(
w	paragraph(
w	paragraph(
text(
If you came here from 
w	paragraph(
text(
I've always believed th
 tools shouldn't be a secret. When I started, most of what I found was either locked behind a paywall, vague on purpose, or built to pump out the same slop everyone's already scrolling past. I didn't want to make that, and I didn't want to learn from people who were gatekeeping the parts that actually matter
o I figured it out the long way
 prompt by prompt, 
Cfailure by failure. These skills are what that process turned into.
w	paragraph(
text(
Each one does a specific job
w	paragraph(
text(
KThey work on their own, but they work best together. Build the world, lock 
, set the scene, 
 make 
L. That's the pipeline I use on my own original projects, and it's the one I'
w	paragraph(
text(
,Below you'll find what each skill does, how 
, and exactly what to ask 
#for to get the best results out of 
z. Download them, install them, take them apart, and make them yours. And if you make something with them, I want to see it
w	paragraph(
text(
Joey
w	paragraph(
text(
Peace
 love
 and ai
w	paragraph(
	UNDEFINED(
horizontalrule
w	paragraph(
w$bfcf2a06-c374-4b43-a2e5-5f00e4b1aa09
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/bfcf2a06-c374-4b43-a2e5-5f00e4b1aa09.jpg
w$3f747450-f912-4e05-a53b-25cc8ed803ff
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/3f747450-f912-4e05-a53b-25cc8ed803ff.jpg
w$bf198fab-8252-4f2c-9010-fe58a0a5c0d0
wohttps://d2ol7oe51mr4n9.cloudfront.net/user_331f3fS1QFk3dF3AmXGIp1vAryH/bf198fab-8252-4f2c-9010-fe58a0a5c0d0.jpg
heading(
text(
The 
,Claude Skills I use in my AI Video Workflow 
text!
2026)
w	paragraph(
text!
,(Note: Many have reworked these skills for C
,hat-GPT Codex and say it works just as well)
generation by generation
	and 100% 
/ and it's important to know how each one works.
w	paragraph(
text!