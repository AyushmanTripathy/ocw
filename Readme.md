# MIT OpenCourseWare

these are the courses i watched or am watching.  
mit ocw is a awesome resource, be sure to utilize it yourself.  

I have made a awesome frontend using dmenu and js for accessing resources (like notes, lecture code, problem sets etc.)

## Frontend Setup

1. get the `ocw` shell script from my [bin](https://github.com/AyushmanTripathy/bin)
1. download course resources from ocw.mit.edu, for [example](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/download)
1. edit the frontend/index.js

```js
// change this to location where you have course materials
const dataLocation = "/home/ayush/ocw/6.006" 

// comment out this function call
init();

// add this instead 
compile(dataLocation + "/pages/lecture-notes/index.html")
```
4. run `node frontend/index.js` and save output in dataLocation/info.json
1. undo the changes in frontend/index.js

now you can browse the notes in dmenu.
