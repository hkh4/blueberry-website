function pspdf() {
  ps2pdf -dNOSAFER $1.ps
  open $1.pdf
}

function blbscore() {
  if [[ "$#" == 0 ]]; then
    echo 'Usage: blbscore <file with code> <name of output file>'
    return 0
  fi
  if [ -z "$2" ]
  then
    OUTFILE='score'
  else
    OUTFILE=$2
  fi
  cwd=$(pwd)
  cd ~/blueberry_lang
  dotnet run score $cwd/$1 $OUTFILE
  pspdf $OUTFILE
  rm $OUTFILE.ps
  mv $OUTFILE.pdf $cwd
  cd $cwd
}

function blbtab() {
  if [[ "$#" == 0 ]]; then
    echo 'Usage: blbtab <file with code> <name of output file>'
    return 0
  fi
  if [ -z "$2" ]
  then
    OUTFILE='tab'
  else
    OUTFILE=$2
  fi
  cwd=$(pwd)
  cd ~/blueberry_lang
  dotnet run tab $cwd/$1 $OUTFILE
  pspdf $OUTFILE
  rm $OUTFILE.ps
  mv $OUTFILE.pdf $cwd
  cd $cwd
}
