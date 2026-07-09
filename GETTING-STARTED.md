# Getting Started with Git & GitHub — Step-by-Step Guide for This Class

This guide assumes you have never used Git or GitHub before. Follow every step in order — don't skip ahead.

---

## Part 1: Install Git

1. Go to https://git-scm.com/downloads
2. Click "Windows". The download should start automatically.
3. Open the downloaded .exe file.
4. Click "Next" through every screen — the default options are fine for everyone. Do not change any settings unless you know what you're doing.
5. Click "Install", then "Finish".

Check it worked:
1. Open Command Prompt (press the Windows key, type cmd, press Enter).
2. Type:
```cmd
git --version
```
3. You should see something like git version 2.4x.x. If you see an error instead, restart your computer and try again.

---

## Part 2: Create a GitHub Account (skip if you already have one)

1. Go to https://github.com
2. Click "Sign up" (top right).
3. Follow the steps: email, password, username.
4. Verify your email when GitHub sends you a confirmation link.

> Note: Send your GitHub username (not your email) to your repo manager so they can invite you. Your username is shown top-right of any GitHub page once logged in.

---

## Part 3: Tell Git Who You Are (one-time setup)

Open Command Prompt and run these two commands, replacing the name/email with your own:

```cmd
git config --global user.name "Your Full Name"
git config --global user.email "youremail@example.com"
```

> Tip: Use the same email you used to sign up for GitHub. This is what shows up next to your commits so your lecturer/groupmates know who did what.

---

## Part 4: Accept Your GitHub Invitation

1. Check your email inbox for a message titled "[Someone] invited you to collaborate on [repo name]".
   - If you don't see it, log into GitHub and go to https://github.com/notifications
2. Click the "View invitation" button in the email, or the invitation in your notifications.
3. Click the green "Accept invitation" button.

> Warning: Invitations expire after 7 days. If yours expired, message the repo manager to send a new one.

---

## Part 5: Download (Clone) the Repository to Your Computer

1. Decide where on your computer you want the project folder to live (e.g., C:\Projects\).
2. Open Command Prompt.
3. Navigate to that location. For example, if you want it in C:\Projects:
```cmd
cd C:\Projects
```
(If the folder doesn't exist yet, create it first: mkdir C:\Projects)
4. Copy the repository's clone link:
   - Go to the repository page on GitHub.
   - Click the green "Code" button.
   - Click the copy icon next to the HTTPS URL (looks like https://github.com/username/pbw-2026-final-projects.git).
5. Back in Command Prompt, type git clone (with a space after it), then paste the link, and press Enter:
```cmd
git clone https://github.com/username/pbw-2026-final-projects.git
```
6. This downloads the entire repository into a new folder named pbw-2026-final-projects inside your current location.
7. Move into that folder:
```cmd
cd pbw-2026-final-projects
```

> Note: You only do Part 5 once per computer. After this, you'll just update your existing copy — you never need to clone again.

---

## Part 6: Find Your Group's Folder

1. Inside the pbw-2026-final-projects folder, look for the folder matching your group number: group-01, group-02, ... group-07.
2. Move into your group's folder:
```cmd
cd group-03
```
(replace group-03 with your actual group number)
3. This is the only folder you should ever add or change files in.

> Warning: Do not create files outside your group folder. Do not edit the root README.md, .gitignore, or CONTRIBUTING.md. Do not touch other groups' folders.

---

## Part 7: Add Your Project Files

Copy your project files (HTML, CSS, JS, images, etc.) into your group's folder using File Explorer, just like copying files normally on Windows — drag and drop them into pbw-2026-final-projects\group-03\ (for example).

You can organize files inside your folder however your group wants (e.g., an src subfolder), but everything must stay inside your group's folder.

---

## Part 8: Save Your Work to GitHub (Commit & Push)

Every time you want to save your progress and upload it, do these 4 steps in this exact order, from inside the pbw-2026-final-projects folder in Command Prompt:

### 8.1 — Pull first (always do this before making changes)
```cmd
git pull
```
What this does: Downloads any new changes from GitHub (e.g., from your groupmates) and merges them into your local copy. Always run this before you start working, to avoid conflicts.

### 8.2 — Add your changes
```cmd
git add group-03
```
(replace group-03 with your group number)

What this does: Tells Git "include everything I changed in this folder in my next save."

### 8.3 — Commit (save a labeled checkpoint)
```cmd
git commit -m "Add homepage and navbar for Group 03"
```
What this does: Saves a snapshot of your staged changes on your computer, with a short message describing what you did. Replace the message with something specific to what you actually changed.

### 8.4 — Push (upload to GitHub)
```cmd
git push
```
What this does: Uploads your saved commit(s) from your computer to the shared repository on GitHub, so everyone can see it.

Full sequence, copy-paste ready (just change the folder name and message):
```cmd
git pull
git add group-03
git commit -m "Describe what you changed here"
git push
```

> Tip: Do this often — every time you finish a meaningful chunk of work (e.g., "finished the homepage"), not just once at the very end. Small, frequent commits are much easier to manage than one giant upload at the deadline.

---

## Part 9: Checking What's Changed (Optional but Useful)

Before adding/committing, you can check what Git sees as changed:
```cmd
git status
```
This lists files you've modified, added, or deleted since your last commit — useful to confirm you're only touching your own folder.

---

## Part 10: What You Should NEVER Do

- Never edit or delete another group's folder.
- Never edit the root README.md, .gitignore, or CONTRIBUTING.md.
- Never run git push --force — this can permanently delete other people's work.
- Never commit passwords, API keys, or .env files.
- Never commit node_modules or other huge dependency folders (these are already blocked by .gitignore, so you shouldn't normally see them, but don't force-add them either).

---

## Part 11: If Something Goes Wrong

"Updates were rejected" when you push:
Someone else pushed changes before you. Run git pull first, then git push again.

You see <<<<<<<, =======, >>>>>>> inside a file:
This means a merge conflict happened. Stop and message [Your Name/Contact] rather than guessing — don't just delete random lines.

"fatal: not a git repository":
You're not inside the pbw-2026-final-projects folder. Run cd to navigate back into it before running any git commands.

Anything else confusing or broken:
Message Raton at ratonbimanto10@gmail.com before trying random fixes. It's much easier to solve a small problem early than to untangle it after more commits.

---

## Quick Reference — The Only Commands You Need

| Command | What it does |
|---|---|
| git clone [url] | Download the repo (do this once) |
| cd foldername | Move into a folder |
| git pull | Download latest changes before you start working |
| git add foldername | Stage your changes for saving |
| git commit -m "message" | Save a labeled snapshot locally |
| git push | Upload your saved snapshots to GitHub |
| git status | Check what's changed since your last commit |

That's genuinely all you need for this project. Good luck!
