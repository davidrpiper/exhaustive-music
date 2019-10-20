#!/bin/sh

for file in *.txt
do
	sed -i.bak '/rt/d' $file
done
