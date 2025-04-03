var x = 10;
var y = 20;
console.log(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
);

function test() {
  let unusedVar = 5;
  let insideTest = 5;
  return x;
}

function anotherTest() {
  insideTest = 6;
  let x = 30;
}

test();
anotherTest();
