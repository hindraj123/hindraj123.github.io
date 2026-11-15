# Hindraj Mali - Engineering & Research Portfolio

Personal portfolio website of **Hindraj Mali** (Second-year Electrical Engineering undergraduate at **VJTI Mumbai**, Core Member of the **Society of Robotics and Automation (SRA)**).

Hosted on **GitHub Pages** at:  
👉 **[https://hindraj123.github.io/](https://hindraj123.github.io/)**

---

## 🪈 Features & Creative Concept

- **Bluish-White Theme:** Ambient, clean frosted-glass aesthetic with soft sky-blue gradients.
- **Matte Black Flute with Peacock Feather (*Mor Pankh*):** Stylized vector art with authentic gold thread bindings (*dhaaga*) and iridescent peacock feather.
- **Scroll-Triggered Swaras (*Sa Re Ga Ma Pa Dha Ni*):** Classical swaras (`सा`, `रे`, `ग`, `म`, `प`, `ध`, `नि`) and musical notes float out from the flute's tone holes as the user scrolls.
- **Synthesized Bansuri Audio:** Built-in Web Audio API synthesizer that softly sounds the corresponding classical frequency (Sa 261Hz, Re 293Hz, etc.) with a toggle button.
- **Academic & Research Highlights:**
  - VJTI Mumbai (Electrical Engineering) & SRA Core Member.
  - Computer Architecture, Reinforcement Learning, and Compilers.
  - Featured Project: **Waddle** — Bipedal locomotion on the 17-DoF Open Duck Mini v2 robot (PPO vs. FlashSAC, custom reward design, gait stability).
- **Live GitHub Integration:** Dynamically fetches public repositories from `github.com/hindraj123`.

---

## 📁 File Structure

```text
hindweb/
│
├── index.html                                  # Main HTML5 structure with SVG Flute & Peacock Feather
├── style.css                                   # Bluish-white theme, glass cards, swara floating physics
├── script.js                                   # Scroll swara emitter, Web Audio synthesizer & GitHub API
├── WhatsApp Image 2026-11-15 at 18.08.43.jpeg  # Profile photo (Hindraj with flute)
└── README.md                                   # Documentation and deployment instructions
```

---

## 🚀 How to Publish to GitHub Pages

### Step 1: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Set the repository name to:
   ```text
   hindraj123.github.io
   ```
3. Set visibility to **Public**.
4. Leave "Add a README file" **unchecked**.
5. Click **Create repository**.

### Step 2: Push your code from your Terminal
Open your terminal in `/Users/hindrajprakashmali/hindweb` and run:

```bash
git init
git add .
git commit -m "feat: Hindraj Mali portfolio with bluish-white theme, black flute, and peacock feather"
git branch -M main
git remote add origin https://github.com/hindraj123/hindraj123.github.io.git
git push -u origin main
```

*(Note: If you have already initialized git, simply run `git add .`, `git commit -m "update"`, and `git push`).*

### Step 3: Open your live website!
Within 60–90 seconds, GitHub Pages will deploy your website live at:
👉 **`https://hindraj123.github.io/`**
