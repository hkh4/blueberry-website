#!/bin/bash
cwd=$(pwd)

while getopts 'f:' flag
do
  case "${flag}" in
    f) OUTFILE=${OPTARG} ;;
  esac
done

OUTFILE2="$(echo -e "${OUTFILE}" | tr -d '[:space:]')"

cd ~/blueberry_lang
path="${cwd}/${OUTFILE2}.blb"
echo $path
dotnet run score $path $OUTFILE2
if [ "$?" -eq "0" ]
then
  ps2pdf -dNOSAFER $OUTFILE2.ps
  rm $OUTFILE2.ps
  mv $OUTFILE2.pdf $cwd
fi
cd $cwd
rm $OUTFILE2.blb
