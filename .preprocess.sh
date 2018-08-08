# npm install html-minifier -g
# npm install uglify-js -g
# npm install csso-cli -g
# brew install rename

# Cleanup from previous (possibly incomplete) runs
find ./ \( -name "*.min.gz" -o -name "*.min" -o -name "*.gz" \) | xargs rm 

find ./ -name "*.html" | xargs -I % html-minifier --collapse-whitespace --remove-comments --remove-optional-tags \
                             --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace \
                             --use-short-doctype % -o %.min

find ./ -name "*.css" | xargs -I % csso % --output %.min

find ./ -name "*.js" | xargs -I % uglifyjs --compress --mangle --verbose -o %.min -- %

find ./ \( -name "*.min" -o -name "*.svg" -o -name "*.txt" -o -name "*.xml" -o -name "*.csv" \
           -o -name "*.json" -o -name "*.bmp" -o -name "*.otf" -o -name "*.ttf" \
           -o -name "*.webmanifest" \) | xargs -I % zopfli -v --i15 %

find ./ -name "*.min.gz" | xargs -I % rename -v 's/\.min.gz$/.gz/' %

find ./ -name "*.min" | xargs rm