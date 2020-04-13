space:= 
space+=
SHELL:=/bin/bash

HTML_DIR := ./
HTML := $(info Finding HTML files...) $(shell find $(HTML_DIR) -name '*.html' | perl -p -e 's/ /\\ /g')
HTML_BR := $(HTML:%.html=%.html.br) 
HTML_GZ := $(HTML:%.html=%.html.gz)
HTML_MIN := $(HTML:%.html=%.html.min)
HTML_FLAGS := --collapse-whitespace \
				--remove-comments \
				--remove-optional-tags \
				--remove-redundant-attributes \
				--remove-script-type-attributes \
				--remove-tag-whitespace \
				--minify-js true \
				--use-short-doctype



CSS_DIR := ./
CSS := $(info Finding CSS files...) $(shell find $(CSS_DIR) -name '*.css' | perl -p -e 's/ /\\ /g')
CSS_BR := $(CSS:%.css=%.css.br)
CSS_GZ := $(CSS:%.css=%.css.gz)
CSS_MIN := $(CSS:%.css=%.css.min)




JS_DIR := ./
JS := $(info Finding JS files...) $(shell find $(JS_DIR) -name '*.js' | perl -p -e 's/ /\\ /g')
JS_BR := $(JS:%.js=%.js.br)
JS_GZ := $(JS:%.js=%.js.gz)
JS_MIN := $(JS:%.js=%.js.min)
JS_FLAGS := --compress --mangle



PNG_DIR := ./
PNG := $(info Finding PNG files...) $(shell find $(PNG_DIR) -name '*.png' | perl -p -e 's/ /\\ /g')
PNG_GZ := $(PNG:%.png=%.png.gz)
PNG_BR := $(PNG:%.png=%.png.br)
PNG_MIN := $(PNG:%.png=%.png.min)


JPEG_DIR := ./
JPEG_GZ := $(info Finding JPEG files...) $(shell find $(JPEG_DIR)  \( -name '*.jpeg' -o -name '*.jpg' \)  | perl -p -e 's/ /\\ /g' | perl -p -e 's/\n/.gz\n/')
JPEG_BR := $(JPEG_GZ:%.gz=%.br)
JPEG_MIN := $(JPEG_GZ:%.gz=%.min)


GIF_DIR := ./
GIF := $(info Finding GIF files...) $(shell find $(GIF_DIR) -name '*.gif' | perl -p -e 's/ /\\ /g')
GIF_GZ := $(GIF:%.gif=%.gif.gz)
GIF_BR := $(GIF:%.gif=%.gif.br)
GIF_MIN := $(GIF:%.gif=%.gif.min)


SVG_DIR := ./
SVG := $(info Finding SVG files...) $(shell find $(SVG_DIR) -name '*.svg' | perl -p -e 's/ /\\ /g')
SVG_GZ := $(SVG:%.svg=%.svg.gz)
SVG_BR := $(SVG:%.svg=%.svg.br)
SVG_MIN := $(SVG:%.svg=%.svg.min)


WEBP_DIR := ./
WEBP := $(info Finding WEBP files...) $(shell find $(WEBP_DIR) -name '*.webp' | perl -p -e 's/ /\\ /g')
WEBP_GZ := $(WEBP:%.webp=%.webp.gz)
WEBP_BR := $(WEBP:%.webp=%.webp.br)
WEBP_MIN := $(WEBP:%.webp=%.webp.min)

MISC_DIR := ./
MISC_TYPES := -name '*.txt' \
                -o -name '*.xml' \
                -o -name '*.csv' \
                -o -name '*.json' \
                -o -name '*.bmp' \
                -o -name '*.otf' \
                -o -name '*.ttf' \
                -o -name '*.webmanifest'

MISC_BR := $(info Finding miscellaneous files...) $(shell find $(MISC_DIR) \( $(MISC_TYPES) \) | perl -p -e 's/ /\\ /g' | perl -p -e 's/\n/.br\n/')
MISC_GZ := $(MISC_BR:%.br=%.gz)






.INTERMEDIATE: $(HTML_MIN) $(CSS_MIN) $(JS_MIN) $(PNG_MIN) $(JPEG_MIN) $(GIF_MIN) $(SVG_MIN)
.PHONY: all size size-detail clean clean-webcontent clean-images misc webcontent html js css images png jpeg gif svg webp jpeg-to-webp
#.SILENT:


webcontent: $(HTML_GZ) $(HTML_BR) $(CSS_BR) $(CSS_GZ) $(JS_BR) $(JS_GZ)
html: $(HTML_GZ) $(HTML_BR)
js: $(JS_BR) $(JS_GZ)
css: $(CSS_BR) $(CSS_GZ)

images: $(PNG_GZ) $(PNG_BR) $(JPEG_GZ) $(JPEG_BR) $(GIF_GZ) $(GIF_BR) $(SVG_GZ) $(SVG_BR) $(WEBP_GZ) $(WEBP_BR) 
png: $(PNG_GZ) $(PNG_BR)
jpeg: $(JPEG_GZ) $(JPEG_BR)
gif: $(GIF_GZ) $(GIF_BR)
svg: $(SVG_GZ) $(SVG_BR)
webp: $(WEBP_GZ) $(WEBP_BR) 
jpeg-to-webp: $(shell find $(JPEG_DIR)  \( -name '*.jpeg' -o -name '*.jpg' \)  | perl -p -e 's/ /\\ /g' | perl -p -e 's/jpeg|jpg/webp/g')
png-to-webp: $(PNG:%.png=%.webp)

misc: $(MISC_BR) $(MISC_GZ)
all: $(HTML_GZ) $(HTML_BR) $(CSS_BR) $(CSS_GZ) $(JS_BR) $(JS_GZ) $(MISC_BR) $(MISC_GZ) $(PNG_GZ) $(PNG_BR) $(JPEG_GZ) $(JPEG_BR) $(GIF_GZ) $(GIF_BR) $(SVG_GZ) $(SVG_BR) $(WEBP_GZ) $(WEBP_BR) 



#
# HTML
#
.SECONDEXPANSION:
%.html.br: $$(subst $$(space),\$$(space),%).html $$(subst $$(space),\$$(space),%).html.min
	$(info HTML Brotli: $@)
	@brotli --force --best -o "$@" "$<.min"

.SECONDEXPANSION:
%.html.gz: $$(subst $$(space),\$$(space),%).html $$(subst $$(space),\$$(space),%).html.min
	$(info HTML Zopfli: $@)
	@zopfli -c "$<.min" >> "$@"

.SECONDEXPANSION:
%.html.min: $$(subst $$(space),\$$(space),%).html
	$(info HTML Minifier: $@)
	@html-minifier $(HTML_FLAGS) "$<" -o "$<.min"



#
# CSS
#
.SECONDEXPANSION:
%.css.br: $$(subst $$(space),\$$(space),%).css $$(subst $$(space),\$$(space),%).css.min
	$(info CSS Brotli: $@)
	@brotli --force --best -o "$@" "$<.min"

.SECONDEXPANSION:
%.css.gz: $$(subst $$(space),\$$(space),%).css $$(subst $$(space),\$$(space),%).css.min
	$(info CSS Zopfli: $@)
	@zopfli -c "$<.min" >> "$@"

.SECONDEXPANSION:
%.css.min: $$(subst $$(space),\$$(space),%).css
	$(info CSS Minifier: $@)
	@cleancss -O2 -o "$<.min" "$<" 



#
# JavaScript
#
.SECONDEXPANSION:
%.js.br: $$(subst $$(space),\$$(space),%).js $$(subst $$(space),\$$(space),%).js.min
	$(info JS Brotli: $@)
	@brotli --force --best -o "$@" "$<.min"

.SECONDEXPANSION:
%.js.gz: $$(subst $$(space),\$$(space),%).js $$(subst $$(space),\$$(space),%).js.min
	$(info JS Zopfli: $@)
	@zopfli -c "$<.min" >> "$@"

.SECONDEXPANSION:
%.js.min: $$(subst $$(space),\$$(space),%).js
	$(info JS Minifier: $@)
	@uglifyjs $(JS_FLAGS) -o "$<.min" -- "$<"




#
# PNG
#
.SECONDEXPANSION:
%.png.br: $$(subst $$(space),\$$(space),%).png $$(subst $$(space),\$$(space),%).png.min
	$(info PNG Brotli: $@)
	@brotli --force --best -o "$@" "$<.min"

.SECONDEXPANSION:
%.png.gz: $$(subst $$(space),\$$(space),%).png $$(subst $$(space),\$$(space),%).png.min
	$(info PNG Zopfli: $@)
	@zopfli -c "$<.min" >> "$@"

.SECONDEXPANSION:
%.png.min: $$(subst $$(space),\$$(space),%).png
	$(info PNG Minifier: $@)
	@optipng -o7 -clobber -silent -preserve -strip all "$<" -out "$<.min"



#
# JPEG
#
.SECONDEXPANSION:
%.jpeg.br: $$(subst $$(space),\$$(space),%).jpeg $$(subst $$(space),\$$(space),%).jpeg.min
	$(info JPEG Brotli: $@)
	@brotli --force --best -o "$@" "$<.min"

.SECONDEXPANSION:
%.jpg.br: $$(subst $$(space),\$$(space),%).jpg $$(subst $$(space),\$$(space),%).jpg.min
	$(info JPEG Brotli: $@)
	@brotli --force --best -o "$@" "$<.min"

.SECONDEXPANSION:
%.jpeg.gz: $$(subst $$(space),\$$(space),%).jpeg $$(subst $$(space),\$$(space),%).jpeg.min
	$(info JPEG Zopfli: $@)
	@zopfli -c "$<.min" >> "$@"

.SECONDEXPANSION:
%.jpg.gz: $$(subst $$(space),\$$(space),%).jpg $$(subst $$(space),\$$(space),%).jpg.min
	$(info JPEG Zopfli: $@)
	@zopfli -c "$<.min" >> "$@"

.SECONDEXPANSION:
%.jpeg.min: $$(subst $$(space),\$$(space),%).jpeg
	$(info JPEG Optimizer: $@)
	@cp "$<" "$<.min"
	@jpegoptim -q -s -m 83 -T 5 "$<.min"

.SECONDEXPANSION:
%.jpg.min: $$(subst $$(space),\$$(space),%).jpg
	$(info JPEG Optimizer: $@)
	@cp "$<" "$<.min"
	@jpegoptim -q -s -m 83 -T 5 "$<.min"




#
# GIF
#
.SECONDEXPANSION:
%.gif.br: $$(subst $$(space),\$$(space),%).gif $$(subst $$(space),\$$(space),%).gif.min
	$(info GIF Brotli: $@)
	@brotli --force --best -o "$@" "$<.min"

.SECONDEXPANSION:
%.gif.gz: $$(subst $$(space),\$$(space),%).gif $$(subst $$(space),\$$(space),%).gif.min
	$(info GIF Zopfli: $@)
	@zopfli -c "$<.min" >> "$@"

.SECONDEXPANSION:
%.gif.min: $$(subst $$(space),\$$(space),%).gif
	$(info GIF Optimizer: $@)
	@gifsicle -o "$<.min" -O3 --careful --no-comments --no-names --same-delay --same-loopcount --no-warnings -- $<




#
# SVG
#
.SECONDEXPANSION:
%.svg.br: $$(subst $$(space),\$$(space),%).svg $$(subst $$(space),\$$(space),%).svg.min
	$(info SVG Brotli: $@)
	@brotli --force --best -o "$@" "$<.min"

.SECONDEXPANSION:
%.svg.gz: $$(subst $$(space),\$$(space),%).svg $$(subst $$(space),\$$(space),%).svg.min
	$(info SVG Zopfli: $@)
	@zopfli -c "$<.min" >> "$@"

.SECONDEXPANSION:
%.svg.min: $$(subst $$(space),\$$(space),%).svg
	$(info SVG Optimizer: $@)
	@svgcleaner --copy-on-error --multipass --quiet "$<" "$<.min.svg" 2>/dev/null
	@mv -f "$<.min.svg" "$<.min"



#
# WEBP
#
.SECONDEXPANSION:
%.webp.br: $$(subst $$(space),\$$(space),%).webp $$(subst $$(space),\$$(space),%).webp.min
	$(info WEBP Brotli: $@)
	@brotli --force --best -o "$@" "$<.min"

.SECONDEXPANSION:
%.webp.gz: $$(subst $$(space),\$$(space),%).webp $$(subst $$(space),\$$(space),%).webp.min
	$(info WEBP Zopfli: $@)
	@zopfli -c "$<.min" >> "$@"

.SECONDEXPANSION:
%.webp.min: $$(subst $$(space),\$$(space),%).webp
	$(info WEBP Optimizer: $@)
	@cwebp -q 83 -alpha_q 83 -pass 10 -m 6 -sharp_yuv -quiet "$<" -o "$<.min"

.SECONDEXPANSION:
%.webp: $$(subst $$(space),\$$(space),%).jpg
	$(info WEBP Converter: $@)
	@cwebp -q 83 -alpha_q 83 -pass 10 -m 6 -sharp_yuv -quiet "$<" -o "$@"

.SECONDEXPANSION:
%.webp: $$(subst $$(space),\$$(space),%).png
	$(info WEBP Converter: $@)
	@cwebp -q 83 -alpha_q 83 -pass 10 -m 6 -sharp_yuv -quiet "$<" -o "$@"


#
# Misc Files
#
.SECONDEXPANSION:
%.br: $$(subst $$(space),\$$(space),%)
	$(info MISC Brotli: $@)
	@brotli --force --best -o "$@" "$<"

.SECONDEXPANSION:
%.gz: $$(subst $$(space),\$$(space),%)
	$(info MISC Zopfli: $@)
	@zopfli -c "$<" >> "$@"



#resize-images: 	
#	@gm convert "$<" -filter lanczos -resize "2000x2000>" "$<.min" 


	
dependencies:
ifeq (, $(shell which zopfli))
	$(info Installing zopfli...)
	@sudo apt-get install zopfli 1>/dev/null
endif
ifeq (, $(shell which brotli))
	$(info Installing brotli...)
	@sudo apt-get install brotli 1>/dev/null
endif
ifeq (, $(shell which gifsicle))
	$(info Installing gifsicle...)
	@sudo apt-get install gifsicle 1>/dev/null
endif
ifeq (, $(shell which jpegoptim))
	$(info Installing jpegoptim...)
	@sudo apt-get install jpegoptim 1>/dev/null
endif
ifeq (, $(shell which optipng))
	$(info Installing optipng...)
	@sudo apt-get install optipng 1>/dev/null
endif

ifeq (, $(shell which svgcleaner))
	$(info Installing svgcleaner...)
ifeq (, $(shell which brew))
	$(info Installing svgcleaner... (This may take a minute or two))
	@/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
	@echo 'eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)' >> ~/.profile
	@eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
endif
	@brew install svgcleaner
endif
	
ifeq (, $(shell which uglifyjs))
	$(info Installing uglify-js...)
ifeq (, $(shell which node))
	$(info Installing node... (This may take a minute or two))
	@curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - 1>/dev/null
	@sudo apt-get install -y nodejs 1>/dev/null
endif
ifeq (, $(shell which npm))
	$(info Installing npm... (This may take a minute or two))
	@curl -L https://npmjs.org/install.sh | sudo sh 1>/dev/null
endif
	@sudo npm install uglify-js -g 1>/dev/null
endif

ifeq (, $(shell which cleancss))
	$(info Installing cleancss...)
ifeq (, $(shell which node))
	$(info Installing node... (This may take a minute or two))
	@curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - 1>/dev/null
	@sudo apt-get install -y nodejs 1>/dev/null
endif
ifeq (, $(shell which npm))
	$(info Installing npm... (This may take a minute or two))
	@curl -L https://npmjs.org/install.sh | sudo sh 1>/dev/null
endif
	@sudo npm install clean-css-cli -g 1>/dev/null
endif

ifeq (, $(shell which html-minifier))
	$(info Installing html-minifier...)
ifeq (, $(shell which node))
	$(info Installing node... (This may take a minute or two))
	@curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - 1>/dev/null
	@sudo apt-get install -y nodejs 1>/dev/null
endif
ifeq (, $(shell which npm))
	$(info Installing npm... (This may take a minute or two))
	@curl -L https://npmjs.org/install.sh | sudo sh 1>/dev/null
endif
	@sudo npm install html-minifier -g 1>/dev/null
endif

ifeq (, $(shell which cwebp))
	$(info Installing webp...)
ifeq (, $(shell which brew))
	@/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
	@echo 'eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)' >> ~/.profile
	@eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
endif
	@brew install webp
endif

	$(info Dependencies up to date.)








#
# Cleaning
#
clean-webcontent:
	$(info Cleaning Webcontent...)
	@rm -f $(HTML_GZ) $(HTML_BR) $(HTML_MIN) $(CSS_GZ) $(CSS_BR) $(CSS_MIN) $(JS_GZ) $(JS_BR) $(JS_MIN)

clean:
	$(info Cleaning All...)
	@rm -f $(HTML_GZ) $(HTML_BR) $(HTML_MIN) $(CSS_GZ) $(CSS_BR) $(CSS_MIN) $(JS_GZ) $(JS_BR) $(JS_MIN) $(MISC_BR) $(MISC_GZ) $(PNG_GZ) $(PNG_BR) $(JPEG_GZ) $(JPEG_BR) $(GIF_GZ) $(GIF_BR) $(SVG_GZ) $(SVG_BR) $(PNG_MIN) $(JPEG_MIN) $(GIF_MIN) $(SVG_MIN) $(WEBP_GZ) $(WEBP_BR)  

clean-images:
	$(info Cleaning Images...)
	@rm -f $(PNG_MIN) $(JPEG_MIN) $(GIF_MIN) $(SVG_MIN) $(PNG_GZ) $(PNG_BR) $(JPEG_GZ) $(JPEG_BR) $(GIF_GZ) $(GIF_BR) $(SVG_GZ) $(SVG_BR) $(WEBP_GZ) $(WEBP_BR) 





#
# Size Listings
#
size: SIZE_GZ = $(shell shopt -s globstar && du -cbs **/*.gz 2>/dev/null | tail -1 | grep -o '[0-9]*')
size: SIZE_BR = $(shell shopt -s globstar && du -cbs **/*.br 2>/dev/null | tail -1 | grep -o '[0-9]*')
size: SIZE_NON_COMP = $(shell shopt -s globstar && du -cbs ** --exclude=*.gz --exclude=*.br | tail -1 | grep -o '[0-9]*')
size: 
	$(info Calculating size data...)
	$(info )
	$(info Size of non-compressed files: $(shell echo $$(( $(SIZE_NON_COMP) / 1024 ))) KB)
	@find -type f ! -name "*.br" ! -name "*.gz" -print0 | \
		du -bax --files0-from=- | \
		sort -k 1 -n -r | \
		head -n 15 | \
		awk 'BEGIN {print "\nTop 15 largest non-compressed files:\nSize (Kbytes) | Filename"} {printf "%-13.1f | %s\n", $$1/(1024), $$2}'

	$(info Size of gzip files: $(shell echo $$(( $(SIZE_GZ) / 1024 ))) KB, $(shell echo $$(( 100 - (($(SIZE_GZ) * 100) / $(SIZE_NON_COMP)) )))% smaller)
	@find -type f -name "*.gz" -print0 | \
		du -bax --files0-from=- | \
		sort -k 1 -n -r | \
		head -n 15 | \
		awk 'BEGIN {print "\nTop 15 largest gzip files:\nSize (Kbytes) | Filename"} {printf "%-13.1f | %s\n", $$1/(1024), $$2}'

	$(info Size of brotli files: $(shell echo $$(( $(SIZE_BR) / 1024 ))) KB, $(shell echo $$(( 100 - (($(SIZE_BR) * 100) / $(SIZE_NON_COMP)) )))% smaller)
	@find -type f -name "*.br" -print0 | \
		du -bax --files0-from=- | \
		sort -k 1 -n -r | \
		head -n 15 | \
		awk 'BEGIN {print "\nTop 15 largest brotli files:\nSize (Kbytes) | Filename"} {printf "%-13.1f | %s\n", $$1/(1024), $$2}'
