#!/bin/bash
cwd=$(pwd)
OUTFILE='score'
cd ~/Desktop/D/nosync.nosync/CS/blueberry-site/blueberry_lang
dotnet run score $cwd/test.blb $OUTFILE
if [ "$?" -eq "0" ]
then
  ps2pdf -dNOSAFER $OUTFILE.ps
  rm $OUTFILE.ps
  mv $OUTFILE.pdf $cwd
  cd $cwd
  open $OUTFILE.pdf
fi
