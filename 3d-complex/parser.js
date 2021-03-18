
//Compile an expression into OpenGL code
function GLcompile(node, variables, functions, errorCheck) {
  errorCheck = errorCheck || false;

  if (variables === undefined) variables = [];
  if (functions === undefined) functions = [];

  if (typeof node === "string") {
    node = math.parse(node);
  }

  function compileNode(node) {
    switch (node.type) {
      case "ConstantNode":
        var num = Number(node.value);
        return `vec2(${num.toFixed(8)},0.0)`;

      case "ParenthesisNode":
        return `(${compileNode(node.content)})`;

      case "OperatorNode":
        switch (node.fn) {
          case "unaryPlus":
            return `(+${compileNode(node.args[0])})`;
          case "unaryMinus":
            return `(-${compileNode(node.args[0])})`;
          case "add":
            return `${compileNode(node.args[0])}+${compileNode(node.args[1])}`;
          case "subtract":
            return `${compileNode(node.args[0])}-${compileNode(node.args[1])}`;
          case "multiply":
            return `mul_C(${compileNode(node.args[0])},${compileNode(node.args[1])})`;
          case "divide":
            return `div_C(${compileNode(node.args[0])},${compileNode(node.args[1])})`;
          case "pow":
            return `pow_C(${compileNode(node.args[0])},${compileNode(node.args[1])})`;
          default:
            throw new Error("Unknown operator: " + node.fn);
        }

      case "FunctionNode":
        var key = node.fn + node.args.length;
        if (errorCheck && !functions.includes(key)) {
          throw new Error("Function " + node.fn + " with " + node.args.length + " argument(s) is undefined");
        }

        var args = node.args.map(function (n) {
          return compileNode(n)
        }).join(",");

        return `${node.fn}_C(${args})`;

      case "SymbolNode":
        var key = node.name;
        if (errorCheck && !variables.includes(key)) {
          throw new Error("Variable " + node.name + " is undefined");
        }

        return node.name + "_C";

      case "AssignmentNode":
        if (node.object.type != "SymbolNode") {
          throw new Error("Can only assign to variables");
        }

        if (node.value.type == "AssignmentNode" || node.value.type == "FunctionAssignmentNode") {
          throw new Error("Right hand side of assignment cannot be a function or assignment");
        }

        var key = node.object.name;

        if (variables.includes(key)) {
          return `${node.object.name}_C = ${compileNode(node.value)};`;
        }

        variables.push(key);
        return `vec2 ${node.object.name}_C = ${compileNode(node.value)};`;

      case "FunctionAssignmentNode":
        if (node.expr.type == "AssignmentNode" || node.expr.type == "FunctionAssignmentNode") {
          throw new Error("Right hand side of function cannot be a function or assignment");
        }

        var key = node.name + node.params.length;
        if (functions.includes(key)) {
          throw new Error("Function " + node.name + " is already defined");
        }

        var initVars = variables;
        variables = variables.concat(node.params);

        var args = node.params.map(function (a) {
          return "vec2 " + a + "_C";
        }).join(", ");

        code = `
vec2 ${node.name}_C(${args}) {
  return ${compileNode(node.expr)};
}
`;

        functions.push(key);
        variables = initVars;
        return code;

      default:
        throw new Error("Unknown node type: " + node.type);
    }
  }

  return compileNode(node);
}

//Compile a block of equations
function GLcompileLines(text, initFunc, variables, functions, errorCheck) {
  initFunc = initFunc || null;
  node = math.parse(text.trim());

  var header = "";
  var body = "";
  var init = "";

  function compileLine(node) {
    switch (node.type) {
      case "AssignmentNode":
        if (initFunc == null) {
          throw new Error("Init function must be provided if variables are assigned to!");
        }

        if (node.object.type != "SymbolNode") {
          throw new Error("Can only assign to variables");
        }

        var key = node.object.name;
        if (!variables.includes(key)) {
          variables.push(key);
          header += "vec2 " + node.object.name + "_C;\n";
        }

        init += GLcompile(node, variables, functions, errorCheck);
        break;

      case "FunctionAssignmentNode":
        body += GLcompile(node, variables, functions, errorCheck);
        break;

      default:
        throw new Error("Each line must be a variable or function");
    }
  }

  if (node.type == "BlockNode") {
    for (var i = 0; i < node.blocks.length; i++) {
      compileLine(node.blocks[i].node);
    }
  } else {
    compileLine(node);
  }

  if (initFunc != null) init = `
void ${initFunc}() {
  ${init}
}
`;

  return header + body + init;
}