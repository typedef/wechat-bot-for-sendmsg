#!/bin/bash

cd `dirname $0`

source ~/.bash_profile
overFind=`grep over out.log`
ret=`ps -ef |grep examples/DiscordAppBot | wc -l`
echo $overFind, 'ret=', $ret

if [ "$overFind" != "" -a $ret -le 1 ]; then
        let ret=`ps -ef |grep examples/DiscordAppBot | wc -l`
        echo 'ret==', $ret
        if [ $ret -lt 2 ]; then
                echo 'start DiscordApp bot ...'
                ./node_modules/.bin/ts-node examples/DiscordAppBot.ts > out.log 2>&1
        elif [ $ret -gt 2 ]; then
                killall -9 node
                echo 'restart all bot ....'
                ./node_modules/.bin/ts-node examples/DiscordAppBot.ts > out.log 2>&1
        fi
fi
