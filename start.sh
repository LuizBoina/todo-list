#!/bin/bash
guake -n mongo -e mongod
guake -n /home/boina/Projects/todo-list/backend -e 'npm start'
guake -n /home/boina/Projects/todo-list/frontend -e 'npm start'
guake -n /home/boina/Projects/todo-list/ -e 'code .'
