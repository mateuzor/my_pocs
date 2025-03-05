var x = 10;
var y = 20;
console.log(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
);

function test() {
  let unusedVar = 5;
  return x;
}

function anotherTest() {
  console.log("debug message");
  let x = 30;
}

test();
