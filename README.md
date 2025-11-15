# BMW @ Karobar 4.0 - Event Website

An interactive event website featuring a 3D BMW X6 model viewer and a spin-the-wheel game.

## Features

- **Interactive 3D Car Model**: View and interact with a 3D BMW X6 model (drag to rotate, scroll to zoom)
- **Spin the Wheel**: Interactive prize wheel game
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: BMW-themed design with animations

## Prerequisites

- A web browser (Chrome, Firefox, Edge, or Safari - latest versions recommended)
- A local web server (required for ES modules and FBX file loading)

## How to Run

**IMPORTANT**: This project must be run on a local web server. Opening `index.html` directly in a browser will NOT work due to ES modules and CORS restrictions.

### Option 1: Python HTTP Server (Recommended)

If you have Python installed:

1. Open Terminal/Command Prompt in the project directory
2. Run one of these commands:

   **Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

3. Open your browser and go to:
   ```
   http://localhost:8000
   ```

4. Press `Ctrl+C` in the terminal to stop the server

### Option 2: Node.js HTTP Server

If you have Node.js installed:

1. Install http-server globally (first time only):
   ```bash
   npm install -g http-server
   ```

2. Open Terminal/Command Prompt in the project directory

3. Run:
   ```bash
   http-server -p 8000
   ```

4. Open your browser and go to:
   ```
   http://localhost:8000
   ```

### Option 3: VS Code Live Server Extension

1. Install VS Code if you haven't already
2. Install the "Live Server" extension in VS Code
3. Right-click on `index.html` in VS Code
4. Select "Open with Live Server"
5. The website will open automatically in your browser

### Option 4: PHP Built-in Server

If you have PHP installed:

1. Open Terminal/Command Prompt in the project directory
2. Run:
   ```bash
   php -S localhost:8000
   ```

3. Open your browser and go to:
   ```
   http://localhost:8000
   ```

### Option 5: Using npx (No Installation Required)

If you have Node.js installed:

1. Open Terminal/Command Prompt in the project directory
2. Run:
   ```bash
   npx http-server -p 8000
   ```

3. Open your browser and go to:
   ```
   http://localhost:8000
   ```

## Project Structure

```
Vishal_event/
│
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript code (3D model & wheel)
├── BMW-logo-new.png    # BMW logo image
├── surya-logo.jpg      # College logo
│
└── bmw-x6/
    └── source/
        └── FINAL_MODEL_16M/
            ├── FINAL_MODEL_16M.fbx    # 3D model file
            └── [texture files]        # Model textures
```

## Troubleshooting

### Model Not Loading

- Make sure you're accessing the site through `http://localhost:8000` (not `file://`)
- Check the browser console (F12) for any error messages
- Verify the FBX file path is correct in `script.js`
- The model may take a few seconds to load depending on file size

### Console Errors

- Open browser Developer Tools (F12) to see detailed error messages
- Check if all files are in the correct locations
- Ensure you're using a modern browser that supports ES modules

### Port Already in Use

If port 8000 is already in use, use a different port:
- Python: `python -m http.server 8080`
- Node.js: `http-server -p 8080`
- Then access: `http://localhost:8080`

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported (version 11+)
- Internet Explorer: ❌ Not supported

## Features Usage

### 3D Model Controls
- **Mouse Drag**: Rotate the model
- **Mouse Wheel**: Zoom in/out
- **Touch**: Drag to rotate on mobile devices

### Spin the Wheel
- Click the "SPIN" button to spin the prize wheel
- Wait for the wheel to stop and see your prize

## Notes

- The 3D model file is large (may take time to load on slower connections)
- If the FBX model fails to load, the site will automatically fall back to a built-in car model
- All interactions work on both desktop and mobile devices

---

## Deployment to Vercel

Vercel provides free hosting for static websites with automatic HTTPS, CDN, and global distribution.

### Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com) - free)
2. Your project code pushed to Git (GitHub, GitLab, or Bitbucket)

### Method 1: Deploy via Vercel Dashboard (Recommended for Beginners)

1. **Push your code to GitHub/GitLab/Bitbucket**
   - Create a new repository on GitHub (or GitLab/Bitbucket)
   - Push your code to the repository

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will automatically detect it's a static site
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)

3. **Your site is live!**
   - Vercel will provide you with a URL like: `your-project-name.vercel.app`
   - Custom domains can be added in project settings

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd Vishal_event
   vercel
   ```

4. **Follow the prompts**
   - First time: Answer questions about your project
   - Set up and deploy: Yes
   - Override settings: No (uses vercel.json)

5. **For production deployment**
   ```bash
   vercel --prod
   ```

### Method 3: Deploy via GitHub Integration

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Connect GitHub to Vercel**
   - Go to Vercel Dashboard
   - Click "Add New Project"
   - Click "Import Git Repository"
   - Select your repository
   - Configure (or use defaults)
   - Click "Deploy"

3. **Automatic deployments**
   - Every push to `main` branch = automatic production deployment
   - Pull requests = automatic preview deployments

### Vercel Configuration

The project includes `vercel.json` with:
- CORS headers for ES modules and FBX files
- Cache headers for static assets
- Proper routing for static files

### Important Notes for Vercel Deployment

✅ **File Size Limits:**
- Individual files: 100MB maximum
- Total project size: Should be reasonable (FBX files can be large)
- Vercel Pro plan allows larger files if needed

✅ **Automatic Features:**
- HTTPS enabled by default
- Global CDN distribution
- Automatic deployments on Git push
- Preview deployments for pull requests

✅ **Custom Domain:**
- Add custom domain in Project Settings → Domains
- Vercel handles SSL certificates automatically

### Troubleshooting Vercel Deployment

**Build fails:**
- Check that `vercel.json` is in the root directory
- Ensure all files are committed to Git
- Check build logs in Vercel dashboard

**FBX file too large:**
- Vercel free tier: 100MB per file limit
- Consider using a CDN for large files (Cloudflare, AWS S3)
- Or upgrade to Vercel Pro plan

**Model not loading:**
- Check browser console for CORS errors
- Verify file paths in `script.js` are correct
- Ensure FBX file is included in Git repository

**404 errors:**
- Make sure `index.html` is in the root directory
- Check `vercel.json` routing configuration
- Verify all assets are included in deployment

### Environment Variables (if needed)

If you need environment variables:
1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy your project

### Deployment Status

After deployment, you'll see:
- ✅ Production URL: `your-project.vercel.app`
- 🔄 Preview URLs: For each branch/PR
- 📊 Analytics: View metrics in dashboard

### Update Your Site

Simply push changes to your Git repository:
```bash
git add .
git commit -m "Update website"
git push
```
Vercel automatically deploys the new version!
