#!/bin/sh

# check for args
if [ $# -lt 1 ]
then
  echo "Usage: $0 input_file [output_file|output_dir]"
  exit 1
fi

# check for input file
if [ ! -f "$1" ]
then
  echo "Input file $1 not found"
  exit 1
fi

filename=$(basename "$1")
filename="${filename%.*}"

# validate inputs
if [ $# -eq 1 ]
then
  output="${filename}.mp3"
else
  output="$2"
  if [ -d "$output" ]
  then
    output="$output/${filename}.mp3"
  else
    dir=$(dirname "$output")
    if [ ! -d "$dir" ]
    then
      echo "Output directory $dir does not exist"
      exit 1
    fi
  fi
fi

ffmpeg -i "$1" -codec:a libmp3lame -qscale:a 0 "$output"
