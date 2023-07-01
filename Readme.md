# MIT OpenCourseWare

these are the courses i watched or am watching.  
mit ocw is a awesome resource, be sure to utilize it yourself.  

I have made a awesome frontend using dmenu and js for accessing resources (like notes, lecture code, problem sets etc.)

## Frontend Setup

1. get the `ocw` shell script from my [bin](https://github.com/AyushmanTripathy/bin)
1. download course resources from ocw.mit.edu, for [example](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/download)
1. keep it in `$HOME/ocw` or change `$dir` in ocw script
1. run frontend/compile.py 

```shell
python3 compile.py PATH_TO_COURSE/pages/lecture-notes/index.html
```
5. if you get a error, remove everything in said html file except table tag
   including the thead tag
1. redirect output of python script to `PATH_TO_COURSE/info.json`
1. run `ocw -o` and watch the magic

now you can browse the notes in dmenu. 
