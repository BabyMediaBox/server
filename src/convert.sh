#!/bin/bash

if [ "$1" == "" ]; then
    echo "Script for testing converter! Use process_videos npm task"
    echo "Arguments: VIDEO_FILE OUTPUT_DIRECTORY";
    echo "Example: ./convert.sh ~/Zaichenceto_bqlo.mkv ~/"
else
    if [ ! -f $1 ]; then
        echo "File not found : "$1
    else

        src_path="$1"
        full_file_name=$(basename "$src_path");
        file_name=${full_file_name%.*}
        if [ "$2" == "" ]; then
            echo "Specify destination directory"
        else
            cmd="ffmpeg -i $1 -c:v libvpx-vp9 -b:v 1M "$2$file_name".webm"
            $($cmd)
        fi
    fi
    
fi