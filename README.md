# pfrostdotme
A repository for the content of the website pfrost.me

## Static GZip Compression & Pre-Processing

The reason there are so many .gz files in this repository is because they are minified and highly compressed versions of each file. This means that the web server (`nginx` in this case) does not need to compress or minify anything on-demand. For obvious reasons this speeds up the serving of files to the client.

I'm using minifiers for html `html-minifier`, JavaScript `uglify-js`, and CSS `csso-cli`, then these filetypes and others (`svg,txt,xml,csv,json,bmp.otf,ttf,webmanifest`) are compressed with `zopfli` which is a slow but powerful `gzip` compressor.

This compresses the home page of my website by ***75%*** compared to serving the uncompressed version.

### Sounds cool I'll do the same!

I've provided the script I wrote to minify and compress everything in `.preprocess.sh`, this is what you should use to pre-process all of your files initially. 

Run this by first installing the dependencies:
```bash
npm install html-minifier -g
npm install uglify-js -g
npm install csso-cli -g
brew install zopfli
brew install rename (I use a mac and the rename utility doesn\'t seem to be there by default)
```
Obviously change `brew` to something else if you're not on MacOS, and `npm` is the package manager for `node.js` so you'll need those installed on your local machine too.

Then just `cd` into the root directory of your web files and run the script. It won't change any existing files, it just creates new minified versions and compresses those.

### Keeping those pre-processed files updated

I've written a Git hooks script to apply the same pre-processing to files that you have changed and about to commit called: `.pre-commit`. 

**You need to do this** otherwise your web server will keep serving the existing `.gz` file with the old version your file in it.

To use this Git hook script you should link / alias it to the correct place in the .git directory with something like:
```bash
sudo ln -s foo/.pre-commit foo/.git/hooks/pre-commit
```
Or you could just move it to `foo/.git/hooks/` and remove the leading `.`

### Telling nginx to use these files you kindly made for it

```bash
sudo nano /etc/nginx/nginx.conf
```

Add:

```bash
    gzip on;
    gzip_static on;
    gzip_vary on;
    gzip_proxied any;

    gzip_types
    application/atom+xml
    application/javascript
    application/json
    application/ld+json
    application/manifest+json
    application/rss+xml
    application/vnd.geo+json
    application/vnd.ms-fontobject
    application/x-font-ttf
    application/x-web-app-manifest+json
    application/xhtml+xml
    application/xml
    application/octet-stream
    font/opentype
    image/bmp
    image/svg+xml
    image/x-icon
    text/cache-manifest
    text/css
    text/plain
    text/vcard
    text/vnd.rim.location.xloc
    text/vtt
    text/x-component
    text/x-cross-domain-policy;
```

```bash
sudo nginx -t
```
Just to check you've just done something stupid

Finally:

```bash
sudo service nginx restart
```