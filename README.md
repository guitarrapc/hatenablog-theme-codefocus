[![Build](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/build.yaml/badge.svg)](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/build.yaml)
[![Release](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/release.yaml/badge.svg)](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/release.yaml)

English | [日本語](README-ja.md)

## CodeFocus

![logo](./logo.png)

A single-column theme designed to make technical articles easy to write.
Responsive design ensures optimal display on all screen sizes: mobile, tablet, and PC.

Prioritizing article readability with a clean design that removes unnecessary decorations, allowing readers to focus on the content.
Code blocks feature a clear color scheme and copy functionality, making it ideal for technical blogs that handle programming code.
By applying JavaScript customizations, you can add distinctive table of contents features (in-page TOC and fixed TOC button) and code block copy functionality, making long articles comfortable to read.
It also supports dark mode, with automatic switching based on system settings or manual switching.

Demo Page
https://codefocus.hatenablog.jp/entry/2025/05/17/015533

For customization instructions, please refer to this article
https://codefocus.hatenablog.jp/entry/2025/05/20/221750

## How to Use

If possible, installation from the Hatena Blog theme store is recommended.

### Install from Hatena Blog Theme Store

Search for "CodeFocus" in the Hatena Blog theme store and install it.
If you want to use JavaScript customizations, follow the setup instructions below.

### JavaScript Customization Setup

Download the latest version of `theme-VERSION.zip`. For example, if the version is v1.6.1, it will be `theme-1.6.1.zip`.

- https://github.com/guitarrapc/HatenaBlog-Theme/releases/latest

The package contains the stylesheet `style.css` and HTML files for theme configuration. The stylesheet is automatically applied when you install the theme from the theme store, so you don't need to manually paste style.css.

#### Code block copy and wrap toggle button features

To improve code block usability, the following features are provided:
- A "copy icon" button appears in the upper right corner of code blocks, clicking it copies the code block.
- A "wrap toggle" button appears in the upper right corner of code blocks, clicking it toggles between wrapped display and horizontal scroll display. By default, it displays without wrapping and allows horizontal scrolling.

> [!TIP]
> Paste [customize-codeblock.html](customize-codeblock.html) into Hatena Blog's "Design" -> "Customize" -> "Header" -> "Below Blog Title".

#### Dark mode feature

A dark mode toggle button appears in the upper right corner of article pages. User selection is remembered for the next visit, and it automatically follows system settings for comfortable nighttime viewing.
- Sun icon: Fixes to light mode
- Moon icon: Fixes to dark mode
- Monitor icon: Automatically switches according to system settings (default)

> [!TIP]
> Paste [customize-dark-mode.html](customize-dark-mode.html) into Hatena Blog's "Design" -> "Customize" -> "Header" -> "Below Blog Title".

#### Tag cloud feature

Displays categories with sizes that vary according to the number of articles.

> [!TIP]
> Paste [customize-tag-cloud.html](customize-tag-cloud.html) into Hatena Blog's "Design" -> "Customize" -> "Header" -> "Below Blog Title".

#### In-article table of contents toggle feature

Enables toggling the table of contents within articles. If there is no table of contents (table-of-contents) in the article, the TOC itself will not be displayed.

> [!TIP]
> Paste [customize-toc-toggle.html](customize-toc-toggle.html) into Hatena Blog's "Design" -> "Customize" -> "Header" -> "Below Blog Title".

#### Fixed "Table of Contents" button feature in the upper right corner of pages

A "Table of Contents" button is fixed in the upper right corner of article pages, and clicking it displays the table of contents. If there is no table of contents (table-of-contents) in the article, the button will not be displayed.

> [!TIP]
> Paste [customize-toc-button.html](customize-toc-button.html) into Hatena Blog's "Design" -> "Customize" -> "Header" -> "Below Blog Title".

## Setting Up the Development Environment

When developing with SCSS, follow these steps to clone the repository and install modules.
Required components are as follows:

- [Node.js](https://nodejs.org/)

### Install Modules

```shell
$ git clone https://github.com/guitarrapc/hatenablog-theme-codefocus.git
$ cd hatenablog-theme-codefocus
$ npm install
$ npx playwright install
```

### Set Up Development Server for Development Blog

By using the development server, you can develop themes while reflecting SCSS changes to your blog in real-time.

First, configure [Hatena Blog](https://blog.hatena.ne.jp/).

1. Prepare one blog to use for testing theme operation. (Create a blog separate from your regular blog.)
2. Access "Design Settings" for the blog from step 1, and replace the content of "Design CSS" in the "Customize" tab with the following and save:
    ``` css
    /* Responsive: yes */
    ```
3. Access "Settings" -> "Advanced Settings" for the blog from step 1, and add the following script tags to "Add metadata to `head` element":
    ``` html
    <script type="module" src="http://localhost:5173/@vite/client" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css" href="http://localhost:5173/scss/style.scss" crossorigin="anonymous" />
    <script type="text/javascript" src="http://localhost:5173/js/codeblock.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://localhost:5173/js/dark-mode.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://localhost:5173/js/tag-cloud.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://localhost:5173/js/toc-toggle.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://localhost:5173/js/toc-button.js" crossorigin="anonymous"></script>
    ```

### Start Development Server

Start the development server with the following command. Replace `BLOG_DOMAIN_NAME` with the domain name of the blog you prepared for testing (e.g., `example.hatenablog.com`).

```shell
$ npm start -- guitarrapc-theme.hatenablog.com
```

Once completed, the theme under development will be reflected in your testing blog. Access the blog and develop the theme while checking the display.

### Test Development Code

Start the server in a separate terminal.
Run tests:

```shell
$ npm run test
```

### Compile for Production

When theme development is complete, compile SCSS with the following command. The compilation result is output to `build/style.css`.

```shell
$ npm run build
```

The compiled CSS can be used by pasting it into Hatena Blog's "Design" -> "Customize" -> "Design CSS".
Use the content of `build/style.css` for CSS uploaded to the store as well.
