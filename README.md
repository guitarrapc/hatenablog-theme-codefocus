[![Build](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/build.yaml/badge.svg)](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/build.yaml)
[![Release](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/release.yaml/badge.svg)](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/release.yaml)

[English](README.md) | [日本語](README.ja.md)

## CodeFocus

A single-column theme designed for technical writing ease.
Responsive design ensures optimal display on all screen sizes: mobile, tablet, and PC.

Prioritizing readability with a clean design that removes unnecessary decoration, allowing focus on the content.
Code blocks feature clear color schemes with copy functionality, making it ideal for technical blogs handling programming code.
With JavaScript customization, you can add distinctive table of contents features (in-page TOC, fixed TOC button) and code block copy functionality for comfortable reading of long articles.
Dark mode support is included, with automatic switching based on system settings or manual control.

Demo page:
https://codefocus.hatenablog.jp/entry/2025/05/17/015533

For customization instructions, refer to this article:
https://codefocus.hatenablog.jp/entry/2025/05/20/221750

## Usage

Installation from Hatena Blog Theme Store is recommended when possible.

### Direct CSS Installation

Download the latest version `theme-VERSION.zip`:

- https://github.com/guitarrapc/HatenaBlog-Theme/releases/latest

The archive contains the stylesheet `style.css` and HTML files for theme configuration.

- Paste `style.css` into Hatena Blog's "Design" -> "Customize" -> "Design CSS"
- Paste `customize-toc-toggle.html` into Hatena Blog's "Design" -> "Customize" -> "Article" -> "Article Top HTML"
- Paste `customize-toc-button.html` into Hatena Blog's "Design" -> "Customize" -> "Article" -> "Article Top HTML"
- Paste `customize-codeblock.html` into Hatena Blog's "Design" -> "Customize" -> "Article" -> "Article Top HTML"
- Paste `customize-dark-mode.html` into Hatena Blog's "Design" -> "Customize" -> "Article" -> "Article Top HTML"

### Install from Hatena Blog Theme Store (Recommended)

Search for "CodeFocus" in the Hatena Blog Theme Store and install it.
Follow these steps to configure JavaScript customizations:

**To Use In-Article TOC Toggle Feature**

This theme includes functionality to toggle the table of contents within articles. Follow these steps to use this feature:

1. Access "Settings" -> "Advanced Settings" and add the following script tag to "Add metadata to head element":

   ``` html
   <script type="text/javascript" src="http://localhost:5173/js/toc-toggle.js" crossorigin="anonymous"></script>
   ```

2. For production use, copy the contents of [customize-toc-toggle.html](customize-toc-toggle.html) and paste into "Design" -> "Customize" -> "Article" -> "Article Top HTML".

   With this configuration, a "TOC" button will appear in the upper right of article pages, displaying the table of contents when clicked. If no table of contents exists in the article, the button won't appear.


**To Use TOC Button Feature**

This theme includes a fixed "TOC" button displayed in the upper right of pages. Follow these steps to use this feature:

1. Access "Settings" -> "Advanced Settings" and add the following script tag to "Add metadata to head element":
   ``` html
   <script type="text/javascript" src="http://localhost:5173/js/toc-button.js" crossorigin="anonymous"></script>
   ```

2. For production use, copy the contents of [customize-toc-button.html](customize-toc-button.html) and paste into "Design" -> "Customize" -> "Header" -> "Below Blog Title".

   With this configuration, a "TOC" button will appear in the upper right of article pages, displaying the table of contents when clicked. If no table of contents exists in the article, the button won't appear.

**To Use Code Block Features**

This theme includes code block-related features. It provides copy and wrap toggle buttons to improve code usability. Follow these steps to use these features:

1. Access "Settings" -> "Advanced Settings" and add the following script tag to "Add metadata to head element":
   ``` html
   <script type="text/javascript" src="http://localhost:5173/js/codeblock.js" crossorigin="anonymous"></script>
   ```

2. For production use, copy the contents of [customize-codeblock.html](customize-codeblock.html) and paste into "Design" -> "Customize" -> "Header" -> "Below Blog Title".

   With this configuration, the following features are enabled:
   - A "Copy icon" button appears in the upper right of code blocks, copying the code block when clicked
   - A "Wrap toggle" button appears in the upper right of code blocks, switching between wrapped display and horizontal scroll display when clicked. By default, display is without wrapping with horizontal scroll available.

**To Use Dark Mode Feature**

This theme includes dark mode functionality. Follow these steps to enable this feature:

1. Access "Settings" -> "Advanced Settings" and add the following script tag to "Add metadata to head element":
   ``` html
   <script type="text/javascript" src="http://localhost:5173/js/dark-mode.js" crossorigin="anonymous"></script>
   ```

2. For production use, copy the contents of [customize-dark-mode.html](customize-dark-mode.html) and paste into "Design" -> "Customize" -> "Header" -> "Below Blog Title".

   With this configuration, three toggle buttons appear in the upper right of article pages:
   - Sun icon: Fixes to light mode
   - Moon icon: Fixes to dark mode
   - Monitor icon: Automatically switches based on system settings (default)

   User selection is remembered on next visit and automatically follows system settings, making nighttime browsing comfortable.

## Setting Up Development Environment

To develop with SCSS, clone the repository and install modules following these steps.
Required components:

- [Node.js](https://nodejs.org/)

### Installing Modules

```shell
$ git clone https://github.com/guitarrapc/hatenablog-theme-codefocus.git
$ cd hatenablog-theme-codefocus
$ npm install
$ npx playwright install
```

### Configuring Development Server for Development Blog

Using the development server allows you to develop the theme while SCSS changes are reflected in real-time to your blog.

First, configure [Hatena Blog](https://blog.hatena.ne.jp/):

1. Prepare one blog for theme testing (create a separate blog from your regular blog).
2. Access the blog's "Design Settings", and replace the "Design CSS" content in the "Customize" tab with the following and save:
    ``` css
    /* Responsive: yes */
    ```
3. Access the blog's "Settings" -> "Advanced Settings" and add the following script tags to "Add metadata to head element":
    ``` html
    <script type="module" src="http://localhost:5173/@vite/client" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css" href="http://localhost:5173/scss/style.scss" crossorigin="anonymous" />
    ```

### Starting Development Server

Start the development server with the following command. Replace `BLOG_DOMAIN_NAME` with your test blog's domain name (e.g., `example.hatenablog.com`):

```shell
$ npm start -- BLOG_DOMAIN_NAME
```

Command execution example:

```shell
$ npm start -- guitarrapc-theme.hatenablog.com
```

After completing these steps, the theme under development will be reflected on your test blog. Access the blog and develop the theme while checking the display.

### Testing Development Code

Start the server in a separate terminal:

```shell
$ npm start -- guitarrapc-theme.hatenablog.com
```

Run tests:

```shell
$ npm run test
```

### Compiling for Production

When theme development is complete, compile SCSS with the following command. The compilation result is output to `build/style.css`:

```shell
$ npm run build
```

The compiled CSS can be pasted into Hatena Blog's "Design" -> "Customize" -> "Design CSS" for use.
For CSS to upload to the store, use the contents of `build/style.css` similarly.
