#!/bin/bash
cd ..
if [ -d "env" ] 
then
    echo "Python virtual environment exists." 
else
    python3 -m venv myenv
fi
echo $PWD
source env/bin/activate

cd Troublemakers

pip3 install -r requirements.txt

if [ -d "logs" ] 
then
    echo "Log folder exists." 
else
    mkdir logs
    touch logs/error.log logs/access.log
fi

sudo chmod -R 777 logs
echo "myenv setup finishes"