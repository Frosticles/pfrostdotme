space:= 
space+=

HTML_DIR := ./
HTML := $(info Calculating HTML filenames...) $(shell find $(HTML_DIR) -name '*.html' | perl -p -e 's/ /\\ /')
HTML_BR := $(info Calculating HTML brotli filenames...) $(HTML:%.html=%.html.br) 
HTML_GZ := $(info Calculating HTML zopfli filenames...) $(HTML:%.html=%.html.gz)
HTML_MIN := $(info Calculating HTML minified filenames...) $(HTML:%.html=%.html.min)
HTML_FLAGS := --collapse-whitespace \
				--remove-comments \
				--remove-optional-tags \
				--remove-redundant-attributes \
				--remove-script-type-attributes \
				--remove-tag-whitespace \
				--minify-js true \
				--use-short-doctype



CSS_DIR := ./
CSS := $(info Calculating CSS filenames...) $(shell find $(CSS_DIR) -name '*.css' | perl -p -e 's/ /\\ /')
CSS_BR := $(info Calculating CSS brotli filenames...) $(CSS:%.css=%.css.br)
CSS_GZ := $(info Calculating CSS zopfli filenames...) $(CSS:%.css=%.css.gz)
CSS_MIN := $(info Calculating CSS minified filenames...) $(CSS:%.css=%.css.min)




JS_DIR := ./
JS := $(info Calculating JS filenames...) $(shell find $(JS_DIR) -name '*.js' | perl -p -e 's/ /\\ /')
JS_BR := $(info Calculating JS brotli filenames...) $(JS:%.js=%.js.br)
JS_GZ := $(info Calculating JS zopfli filenames...) $(JS:%.js=%.js.gz)
JS_MIN := $(info Calculating JS minified filenames...) $(JS:%.js=%.js.min)
JS_FLAGS := --compress --mangle



MISC_DIR := ./
MISC_TYPES := -name '*.svg' \
                    -o -name '*.txt' \
                    -o -name '*.xml' \
                    -o -name '*.csv' \
                    -o -name '*.json' \
                    -o -name '*.bmp' \
                    -o -name '*.otf' \
                    -o -name '*.ttf' \
                    -o -name '*.webmanifest'
MISC_BR := $(info Calculating MISC brotli filenames...) $(shell find $(MISC_DIR) \( $(MISC_TYPES) \) | perl -p -e 's/ /\\ /' | perl -p -e 's/\n/.br\n/')
MISC_GZ := $(info Calculating MISC zopfli filenames...) $(shell find $(MISC_DIR) \( $(MISC_TYPES) \) | perl -p -e 's/ /\\ /' | perl -p -e 's/\n/.gz\n/')


.PHONY: all clean

all: $(HTML_GZ) $(HTML_BR) $(CSS_BR) $(CSS_GZ) $(JS_BR) $(JS_GZ) $(MISC_BR) $(MISC_GZ)


.SECONDEXPANSION:
%.html.br: $$(subst $$(space),\$$(space),%).html
	$(info HTML Brotli: $@)
	@html-minifier $(HTML_FLAGS) "$<" -o "$<.min"
	@brotli --force --best -o "$@" "$<.min"
	@rm -f "$<.min"

.SECONDEXPANSION:
%.html.gz: $$(subst $$(space),\$$(space),%).html
	$(info HTML Zopfli: $@)
	@html-minifier $(HTML_FLAGS) "$<" -o "$<.min"
	@zopfli -c "$<.min" >> "$@"
	@rm -f "$<.min"



.SECONDEXPANSION:
%.css.br: $$(subst $$(space),\$$(space),%).css
	$(info CSS Brotli: $@)
	@csso "$<" --output "$<.min"
	@brotli --force --best -o "$@" "$<.min"
	@rm -f "$<.min"

.SECONDEXPANSION:
%.css.gz: $$(subst $$(space),\$$(space),%).css
	$(info CSS Zopfli: $@)
	@csso "$<" --output "$<.min"
	@zopfli -c "$<.min" >> "$@"
	@rm -f "$<.min"


.SECONDEXPANSION:
%.js.br: $$(subst $$(space),\$$(space),%).js
	$(info JS Brotli: $@)
	@uglifyjs $(JS_FLAGS) -o "$<.min" -- "$<"
	@brotli --force --best -o "$@" "$<.min"
	@rm -f "$<.min"

.SECONDEXPANSION:
%.js.gz: $$(subst $$(space),\$$(space),%).js
	$(info JS Zopfli: $@)
	@uglifyjs $(JS_FLAGS) -o "$<.min" -- "$<"
	@zopfli -c "$<.min" >> "$@"
	@rm -f "$<.min"


.SECONDEXPANSION:
%.br: $$(subst $$(space),\$$(space),%)
	$(info MISC Brotli: $@)
	@brotli --force --best -o "$@" "$<"

.SECONDEXPANSION:
%.gz: $$(subst $$(space),\$$(space),%)
	$(info MISC Zopfli: $@)
	@zopfli -c "$<" >> "$@"

clean:
	$(info Cleaning...)
	@rm -f $(HTML_GZ) $(HTML_BR) $(HTML_MIN) $(CSS_GZ) $(CSS_BR) $(CSS_MIN) $(JS_GZ) $(JS_BR) $(JS_MIN) $(MISC_BR) $(MISC_GZ)
