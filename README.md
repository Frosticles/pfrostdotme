# pfrostdotme
A repository for the content of the website pfrost.me

## Static File Compression & Pre-Processing

The reason there are so many .gz and .br files in this repository is because they are minified and compressed versions of each file. This means that the web server (`nginx` in this case) does not need to compress or minify anything on-demand. For obvious reasons this speeds up the serving of files.

I made the [sitecompiler](https://github.com/badcf00d/sitecompiler/) project to automate the creation and updating of all of these files. Using this compresses the home page of my website by 80% compared to serving the raw, uncompressed version.

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
