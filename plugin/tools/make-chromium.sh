#!/bin/bash
#
# This script assumes a linux environment

echo "*** humancredit.chromium: Creating web store package"
echo "*** humancredit.chromium: Copying files"

DES=dist/build/humancredit.chromium
rm -rf $DES
mkdir -p $DES

cp -R assets $DES/
rm $DES/assets/*.sh
cp -R src/css $DES/
cp -R src/img $DES/
cp -R src/js $DES/
cp -R src/lib $DES/
cp -R src/_locales $DES/
cp -R $DES/_locales/nb $DES/_locales/no
cp src/*.html $DES/
cp platform/chromium/*.js $DES/js/
cp -R platform/chromium/img $DES/
cp platform/chromium/*.html $DES/
cp platform/chromium/manifest.json $DES/
cp LICENSE.txt $DES/

if [ "$1" = all ]; then
    echo "*** humancredit.chromium: Creating package..."
    pushd $(dirname $DES/)
    zip humancredit.chromium.zip -qr $(basename $DES/)/*
    popd
fi

echo "*** humancredit.chromium: Package done."
