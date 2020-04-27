# pfrostdotme
A repository for the content of the website pfrost.me

## Static File Compression & Pre-Processing

The reason there are so many .gz and .br files in this repository is because they are minified and highly compressed versions of each file. This means that the web server (`nginx` in this case) does not need to compress or minify anything on-demand. For obvious reasons this speeds up the serving of files to the client.

I'm using minifiers for html `html-minifier`, JavaScript `uglify-js`, and CSS `csso-cli`, then these filetypes and others (`svg,txt,xml,csv,json,bmp,otf,ttf,webmanifest`) are compressed with `zopfli`, which is a slow but powerful gzip compressor, and `brotli` which is a slightly more exotic twist on gzip that isn't as well supported, but produces smaller files.

This compresses the home page of my website by 80% compared to serving the uncompressed version.

### Sounds cool I'll do the same!

I've provided the script I wrote to minify and compress everything in `.preprocess.sh`, this is what you should use to pre-process all of your files initially. 

Run this by first installing the dependencies:
```bash
npm install html-minifier -g
npm install uglify-js -g
npm install csso-cli -g
brew install zopfli
brew install brotli
brew install rename (I use a mac and the rename utility doesn't seem to be there by default)
```
Obviously change `brew` to something else if you're not on MacOS, and `npm` is the package manager for `node.js` so you'll need those installed on your local machine too.

Then just `cd` into the root directory of your web files and run the script. It won't change any existing files, it just creates new minified versions and compresses those.

### Keeping those pre-processed files updated

I've written a Git hooks script to apply the same pre-processing to files that you have changed and about to commit called: `.pre-commit`. 

**You need to do this** otherwise your web server will keep serving the existing `.gz` or `.br` file with the old version your file in it.

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
    gzip_static on;
    brotli_static on;
```

Just to check if you've just done something stupid
```bash
sudo nginx -t
```

Finally:
```bash
sudo service nginx restart
```
