var currentUserString = "";

//function that adds to the end of the string user is creating
function continueString(userInput) {
  currentUserString = currentUserString + String(userInput);
  document.getElementById("displayArea").innerHTML = currentUserString;
}

//function that clears everything and replaces with 0
function resetCurrentString() {
  currentUserString = "";
  //display a zero even though currentUserString is empty
  document.getElementById("displayArea").innerHTML = "0";
}

//function that deletes end of user string. It undoes the user's last action or deletes the last number of a calculation
function undoPrevious () {
  var regLastInputted = new RegExp(".$","g");
  currentUserString = currentUserString.replace(regLastInputted,"");
  document.getElementById("displayArea").innerHTML = currentUserString;
}

//this function takes every symbol: +, -, /, *, ^ and does a regular expression with spaces it which we will then feed into another function.
function fixString (str) {
  var currentUserString = str;
  //console.log("originally user string is ", currentUserString);

  /*fix cases -- ++, -+, and +- */
  if (currentUserString.indexOf("--") !== -1) {
    var regExMinusMinus = new RegExp("--","g")
    currentUserString = currentUserString.replace(regExMinusMinus, "+");
  }

  if (currentUserString.indexOf("++") !== -1) {
    var regExPlusPlus = new RegExp("\\+\\+","g")
    currentUserString = currentUserString.replace(regExPlusPlus, "+");

  }

  if (currentUserString.indexOf("-+") !== -1) {
    var regExMinusPlus = new RegExp("-\\+","g")
    currentUserString = currentUserString.replace(regExMinusPlus, "-");
  }

  if (currentUserString.indexOf("+-") !== -1) {
    var regExPlusMinus = new RegExp("\\+-","g")
    currentUserString = currentUserString.replace(regExPlusMinus, "-");
  }

  //special case for ^-. This will prevent problems because the - might otherwise be parsed incorrectly.
  if (currentUserString.indexOf("^-") !== -1) {
    //console.log("there is a case of ^-");
    var regExAA = new RegExp("\\^-","g")
    currentUserString = currentUserString.replace(regExAA, "SPECIALCASEAAA");
    //console.log("after doing reg expression for ^-, currentUserString is ", currentUserString);
  }

  //pi case
  if (currentUserString.indexOf("π") !== -1) {
    var regExPi = new RegExp("π","g");
    currentUserString = currentUserString.replace(regExPi, Math.PI);
  }

  //special case for *- to prevent problems
  if (currentUserString.indexOf("*-") !== -1) {
    var regExMultSpecial = new RegExp("\\*-","g");
    currentUserString = currentUserString.replace(regExMultSpecial, "SPECIALCASEBBB");
  }

  if (currentUserString.indexOf("^") !== -1) {
    //now for special case of a minus number to any exponent. -x ^ y should be considered -1 * x ^ y since parentheses not given
    //temporarily make an array from the string so can change an index if needed. Change the - sign to something temporarily which we will change later. I don't want other reg expressions touching the - sign if part of base of power
    var onlyTempArray = currentUserString.split('');
    for (var r = 0; r < onlyTempArray.length; r++) {
      if (onlyTempArray[r] == "^" && onlyTempArray[r-2] && onlyTempArray[r-2] == "-") {
        onlyTempArray[r-2] = "SPECIALCASECCC";
      }
    }
    //now change back to a string
    currentUserString = onlyTempArray.join("");
    var regExExp = new RegExp("\\^","g")
    currentUserString = currentUserString.replace(regExExp, " ^ ");
  }

  if (currentUserString.indexOf("*") !== -1) {
    var regExMult = new RegExp("\\*","g");
    currentUserString = currentUserString.replace(regExMult, " * ");
  }

  //to fix pemdas, replace every / by * 1/
  if (currentUserString.indexOf("/") !== -1) {
    var regExDiv = new RegExp("\/","g");
    currentUserString = currentUserString.replace(regExDiv, " * 1/");
    //console.log("after doing reg expression for division, currentUserString is ", currentUserString);
  }

  if (currentUserString.indexOf("+") !== -1) {
    var regExAdd = new RegExp("\\+","g");
    currentUserString = currentUserString.replace(regExAdd, " + ");
  }

  //do this to fix pemdas. Replace every subtract by + -
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^CURRENTLY TRYING SPECIAL CASE of like 12*3+3-9^2/3  want something different than  "+", "-1*9",
  //subtraction, though I might need to comment this out again
  if (currentUserString.indexOf("-") !== -1) {
   var regExSub = new RegExp("-","g");
   //will the following fix the case of multiplying by a negative number and another number squared?
    currentUserString = currentUserString.replace(regExSub, " + -1 * ");
  }

  //Now fix special cases

  //fix special case which is ^-
  if (currentUserString.indexOf("SPECIALCASEAAA") !== -1) {
    //console.log("before fixing ^-, currentUserString is ",currentUserString);
    var regExFixSpecialExp = new RegExp("SPECIALCASEAAA","g");
    currentUserString = currentUserString.replace(regExFixSpecialExp, " ^ -");
    //console.log("after fixing ^-, currentUserString is ",currentUserString);
  }

  //fix special case which is *-1
  if (currentUserString.indexOf("SPECIALCASEBBB") !== -1) {
   var regExFixSpecialMult = new RegExp("SPECIALCASEBBB","g");
    currentUserString = currentUserString.replace(regExFixSpecialMult, " * -1 * ");
  }

  //fix special case where you have a negative number to any exponent. Example. -2^2 should actually be calcuated as -1 * 2^2 since no parentheses are given
  if (currentUserString.indexOf("SPECIALCASECCC") !== -1) {
    var regExFixNegBase = new RegExp("SPECIALCASECCC","g");
    currentUserString = currentUserString.replace(regExFixNegBase, " + -1 * ");
    //console.log("after fixing -num^, currentUserString is ",currentUserString);
  }

  if (currentUserString.indexOf("(") !== -1) {
    //console.log("there is a case of (");
    var regExLeft = new RegExp("\\(","g")
    currentUserString = currentUserString.replace(regExLeft, "( ");
    //console.log("after doing reg expression for (, currentUserString is ", currentUserString);
  }

  //right paren
  if (currentUserString.indexOf(")") !== -1) {
    //console.log("there is a case of )");
    var regExRight = new RegExp("\\)","g")
    currentUserString = currentUserString.replace(regExRight, " )");
    //console.log("after doing reg expression for ), currentUserString is ", currentUserString);
  }

  //function to compare 2 arrays as needed below
  function compareTwoArrays (arrA, arrB) {
    if (arrA.length != arrB.length) {
      return false;
    }
    var truthValue = true;
    for (var e = 0; e < arrA.length; e++) {
      if (arrA[e] !== arrB[e]) {
        truthValue = false;
      }
    }
    return truthValue;
  }

  //console.log("SUPPPPPPPPPPPPPPPPPPPPPPPPPPPPPER currentUserString is ", currentUserString);
  //console.log("now all of its elements are ");
  //console.log("is currentUserString[0] == empty string? ", currentUserString[0] == "");
  //console.log("is currentUserString[0] == space? ", currentUserString[0] == " ");
  //console.log("is currentUserString[1] == +? ", currentUserString[1] == "+");
  //console.log("is currentUserString[2] == empty string? ", currentUserString[2] == "");
  //console.log("is currentUserString[2] == space? ", currentUserString[2] == " ");

  for (var aaa = 0; aaa < currentUserString.length; aaa++) {
    //console.log("index ", aaa, " is ", currentUserString[aaa]);
  }

  //****We now know currentUserString[0] == " ", currentUserString[1] == "+", currentUserString[2] == " "

  // a last fix. For -a^-b^-c for example -5^-2^-2 which would be parsed as + -1 * 5 ^ -2 ^ -2, remove space + space if starting in beginning, so that it gets parsed as -1 * 5 ^ -2 ^ -2
  //convert currentUserString to another temp array
  var tempArrayAnother = currentUserString.split('');
  //if ^ + , then delete that
    if (  compareTwoArrays ( tempArrayAnother.slice(0,3) , [" ","+", " "] ) == true ) {
      //console.log("******************************* there is a case of fixing beginning ' ' , '+', ' '");
      tempArrayAnother.splice(0,3);
  }
  //convert tempArrayAnother back to currentUserString
  currentUserString = tempArrayAnother.join('');

  //finally convert currentUserString into an array, splitting up every character into an index
  var tempArray = currentUserString.split(' ');
  //console.log("array that will be passed to other function is " , tempArray);
  return tempArray;
} //end of function


function parseMult(arr) {
  function subParseStuff (otherArr) {
    //console.log("originally otherArr is ", otherArr);
    if (otherArr.length == 0) {
      return 0;
    }

    if (otherArr.length == 1) {
      return otherArr[0];
    }

    while(otherArr.indexOf("(") !== -1) {
      //console.log("subParseStuff is in the loop for  (");
      //with ( and ), we just force to do calculations inside them, but will then discard the tokens
      //console.log("inside the ( loop, otherotherArris  " , otherArr);
      //use lastIndex of for ( and first index for )
      var tempLeftA = otherArr.lastIndexOf("(");
      var tempRightA = otherArr.indexOf(")");
      return subParseStuff( otherArr.slice(0, tempLeftA) ) + subParseStuff( otherArr.slice(tempLeftA+1, tempRightA) ) + subParseStuff(otherArr.slice(tempRightA+1,otherArr.length));
    }

    //exponent for subParseStuff
    while(otherArr.indexOf("^") !== -1) {
      //console.log("inside the ^ loop, otherArr is  " , otherArr);
      //console.log("otherArr has length ", otherArr.length);

      //****** We must use lastIndexOf instead of IndexOf for exponent because of the special case of a ^ b ^ c . a ^ b ^ c is NOT the same as (a^b)^c. For ex. 8 ^ 2 ^ -1. If you just do left to write you will get 64 ^ -1 = 0.015625
      //but above is wrong. 8 ^ 2 ^ -1 should be done right to left. It will actually end up being 8 ^ (1/2)   or 8 ^ .5 which is 2.8284271247461903
      //another example.  2 ^ 3 ^ 3  = 134217728, but (2^3) ^ 3 is 512
      var tempA = otherArr.lastIndexOf("^");
      //console.log("after doing otherArr.indexOf otherArr has length ", otherArr.length);
      //console.log("currently index for ^ is ", tempA);
      //console.log("in ^ loop otherArr previous is" , otherArr[2], " and otherArr tempA +1 is ", otherArr[tempA+1]);
      //console.log("just double checking, otherArr is ", otherArr);

      //if base is negative
      if (eval(otherArr[tempA-1]) < 0) {
        var expOfNumsArray  =  [ eval( -1 * Math.pow( eval(otherArr[tempA-1] * -1) ,eval(otherArr[tempA+1]) ) ) ];
        return subParseStuff( otherArr.slice(0,tempA-1).concat(expOfNumsArray.concat(otherArr.slice(tempA+2,otherArr.length ) ) ) );
      }

      else {
        //below unfortunately won't work with parseFloat if there are fractions. If there is a fraction, the denomiator will be dropped, so need to use eval
        var expOfNumsArray  =  [ eval(Math.pow( eval(otherArr[tempA-1]) ,eval(otherArr[tempA+1]) ) ) ];
        return subParseStuff( otherArr.slice(0,tempA-1).concat(expOfNumsArray.concat(otherArr.slice(tempA+2,otherArr.length ) ) ) );
      }
  }
  //console.log("after while loop for ^, otherArr is ", otherArr);

    //multiplication for subParseStuff
    while(otherArr.indexOf("*") !== -1) {
      //console.log("subParseStuff is in the loop for *");
      //console.log("and the value of otherArr is ", otherArr);
      //the index is very important. Otherwise we get an infinite loop
      var tempA = otherArr.indexOf("*");
      var multOfNumsArray  =  [ eval(otherArr[tempA-1]) * eval(otherArr[tempA+1]) ];
      //console.log("multOfNumsArray is " , multOfNumsArray);
      //since we take the first one on the left, we don't have to be concernted about concatenating the left side
      return subParseStuff( otherArr.slice(0,tempA-1).concat(multOfNumsArray.concat(otherArr.slice(tempA+2,otherArr.length ) ) ) );
    }
    //console.log("after while loop of * inside sub for *, otherArr is ", otherArr);

    //addition for subParseStuff
    while(otherArr.indexOf("+") !== -1) {
      //console.log("subParseStuff is in the loop for  +");
      //console.log("in for loop for +, currently otherArr is ", otherArr)
      //print("we know it has a + in it");
      var tempA = otherArr.indexOf("+");
      var sumOfAdditionArray = [ parseFloat(otherArr[tempA-1]) + parseFloat(otherArr[tempA+1]) ];
      //below is a little complicated, but the only way I could get it to work
      return subParseStuff( otherArr.slice(0,tempA-1) ) +  subParseStuff ( sumOfAdditionArray.concat(otherArr.slice(tempA+2,otherArr.length ) )  );
    }
  } //end of subParseStuff

  //remember to go in order of operations. Parentheses, exponent, multipy, divide, add, subtract
  //we don't need subtraction case because. for a - b, we said it is the same as a + -1*b
  //we don't need division case because. for a/b, we said it is the same as a * 1/b (look at how it is implemented)
  //console.log("originally arr is ", arr);

  while(arr.indexOf("(") !== -1) {
    //with ( and ), we just force to do calculations inside them, but will then discard the tokens
    //console.log("inside the ( loop, arr is  " , arr);
    //use lastIndex of for ( and first index for )
    var tempLeft = arr.lastIndexOf("(");
    var tempRight = arr.indexOf(")");
    var newArray = [];
    newArray = newArray.concat( arr.slice(0, tempLeft) );
    newArray = newArray.concat (subParseStuff( arr.slice(tempLeft+1, tempRight) ));
    newArray = newArray.concat ( arr.slice(tempRight+1,arr.length) );
    //arr = newArray; otherwise an infinite loop
    arr = newArray;
  }
  //console.log ("after ( arr is" , arr);

  //exponent
  while(arr.indexOf("^") !== -1) {
    //console.log("inside the ^ loop, arr is  " , arr);
    //console.log("arr has length ", arr.length);
    //****** We must use lastIndexOf instead of IndexOf for exponent because of the special case of a ^ b ^ c . a ^ b ^ c is NOT the same as (a^b)^c. For ex. 8 ^ 2 ^ -1. If you just do left to write you will get 64 ^ -1 = 0.015625
    //but above is wrong. 8 ^ 2 ^ -1 should be done right to left. It will actually end up being 8 ^ (1/2)   or 8 ^ .5 which is 2.8284271247461903
    //another example.  2 ^ 3 ^ 3  = 134217728, but (2^3) ^ 3 is 512
    var temp = arr.lastIndexOf("^");
    var newArray = [];
    //console.log("after doing arr.indexOf arr has length ", arr.length);
    //console.log("currently index for ^ is ", temp);
    //console.log("in ^ loop arr previous is" , arr[2], " and arr temp +1 is ", arr[temp+1]);
    //console.log("just double checking, arr is ", arr);
    newArray = newArray.concat ( arr.slice(0,temp-1) );

    //if base is negative
    if (eval(arr[temp-1]) < 0) {
      newArray = newArray.concat(   eval( -1 * Math.pow( eval(arr[temp-1] * -1) ,eval(arr[temp+1]) ) ) );
      newArray = newArray.concat ( arr.slice(temp+2,arr.length) );
    }  else {
    //below unfortunately won't work with parseFloat if there are fractions. If there is a fraction, the denomiator will be dropped, so need to use eval
    newArray = newArray.concat(  Math.pow( eval(arr[temp-1]) ,eval(arr[temp+1]) ) );
    newArray = newArray.concat ( arr.slice(temp+2,arr.length) );
    }
    arr = newArray;
  }
  //console.log("after while loop for ^, arr is ", arr);

  //multiplication
  while(arr.indexOf("*") !== -1) {
    //the index is very important. Otherwise we get an infinite loop
    var temp = arr.indexOf("*");
    var newArray = [];
    newArray = newArray.concat ( arr.slice(0,temp-1) );
    newArray = newArray.concat( eval(arr[temp-1]) * eval(arr[temp+1])   );
    newArray = newArray.concat ( arr.slice(temp+2,arr.length) );
    arr = newArray;
  }

  //addition
  while(arr.indexOf("+") !== -1) {
    //print("we know it has a + in it");
    var temp = arr.indexOf("+");
    var newArray = [];
    newArray = newArray.concat ( arr.slice(0,temp-1) );
    newArray = newArray.concat( parseFloat(arr[temp-1]) + parseFloat(arr[temp+1])   );
    newArray = newArray.concat ( arr.slice(temp+2,arr.length) );
    arr = newArray;
  }
  //console.log("before displaying answer, answer is ", arr)
  //arr should have just 1 number in it. Take arr, and convert it into a string and assign that to currentUserString
  currentUserString = arr.join('');
  currentUserString = cutStringLength(currentUserString);
  document.getElementById("displayArea").innerHTML = currentUserString;
}

//function to make sure length of string doesn't overflow with too many digits
function cutStringLength (str) {
  if (str.length >= 17) {
    //for VERY large numbers. Forcing the number to scientific notation will prevent overflow
    if (eval(str) >= Math.pow(10,16) ) {
      var strAsNum = eval(str);
      var numInScientificNotation = strAsNum.toExponential(10);
      str = numInScientificNotation.toString();
    }

    //simply cut off part of string after length 17 if smaller than 10 ^ 16
    else if (eval(str) < Math.pow(10,16) ) {
      tempA = str.split('');
      splicedArray = [];
      for (var a = 0; a < 16; a++) {
        splicedArray.push(tempA[a]);
      }
      str = splicedArray.join('');
    }
  }

  return str;
}
