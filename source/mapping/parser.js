/*
  Author: David Block
  Soruce: https://replit.com/@DavidBrock1/complexplotter#parser.js
*/

function GLcompile(node, scope) {
  if (scope === undefined) {
    scope = {};
  }

  if (scope.variables === undefined) scope.variables = [];
  if (scope.functions === undefined) scope.functions = [];

  if (typeof node === "string") {
    node = math.parse(node);
  }

  //If multiline, each line must be a variable or function assignment
  if (node.type == "BlockNode") {
    var code = "";

    //compile all variables
    for (var i = 0; i < node.blocks.length; i++) {
      switch (node.blocks[i].node.type) {
        case "AssignmentNode":
        case "FunctionAssignmentNode":
          code += GLcompile(node.blocks[i].node, scope);
          break;
        
        default:
          throw new Error("Each line must be a variable or function assignment, not " + node.blocks[i].node.type);
      }
    }

    return code;
  }

  switch (node.type) {
    case "ConstantNode":
      var num = Number(node.value);
      return `vec2(${num.toFixed(8)},0.0)`;

    case "ParenthesisNode":
      return `(${GLcompile(node.content, scope)})`;

    case "OperatorNode":
      switch (node.fn) {
        case "unaryPlus":
          return `(+${GLcompile(node.args[0], scope)})`;
        case "unaryMinus":
          return `(-${GLcompile(node.args[0], scope)})`;
        case "add":
          return `${GLcompile(node.args[0], scope)}+${GLcompile(node.args[1], scope)}`;
        case "subtract":
          return `${GLcompile(node.args[0], scope)}-${GLcompile(node.args[1], scope)}`;
        case "multiply":
          return `mul_C(${GLcompile(node.args[0], scope)},${GLcompile(node.args[1], scope)})`;
        case "divide":
          return `div_C(${GLcompile(node.args[0], scope)},${GLcompile(node.args[1], scope)})`;
        case "pow":
          return `pow_C(${GLcompile(node.args[0], scope)},${GLcompile(node.args[1], scope)})`;
        default:
          throw new Error("Unknown operator: " + node.fn);
      }

    case "FunctionNode":
      var key = node.fn + node.args.length;
      if (!scope.functions.includes(key) && !baseScope.functions.includes(key)) {
        throw new Error("Function " + node.fn + " with " + node.args.length + " argument(s) is undefined");
      }

      var args = node.args.map(function (n) {
        return GLcompile(n, scope)
      }).join(",");

      return `${node.fn + "_C"}(${args})`;

    case "SymbolNode":
      var key = node.name;
      if (!scope.variables.includes(key) && !baseScope.variables.includes(key)) {
        throw new Error("Variable " + node.name + " is undefined");
      }

      return node.name;
    
    case "AssignmentNode":
      if (node.object.type != "SymbolNode") {
        throw new Error("Can only assign to variables");
      }

      var key = node.object.name;
      if (scope.variables.includes(key) || baseScope.variables.includes(key)) {
        throw new Error("Variable " + node.object.name + " is already defined");
      }
      scope.variables.push(key);

      return `vec2 ${node.object.name} = ${GLcompile(node.value, scope)};`;
    
    case "FunctionAssignmentNode":
      var key = node.name + node.params.length;
      if (scope.functions.includes(key) || baseScope.functions.includes(key)) {
        throw new Error("Function " + node.name + " is already defined");
      }

      var newScope = {
        variables: scope.variables.concat(node.params),
        functions: scope.functions
      };
      var args = node.params.map(function (a) {
        return "vec2 " + a;
      }).join(", ");

      code = `
vec2 ${node.name}_C(${args}) {
  return ${GLcompile(node.expr, newScope)};
}`;

      scope.functions.push(key);
      return code

    default:
      throw new Error("Unknown node type: " + node.type);
  }
}
/*
function GLcompileNode(node, scope) {
  compileFunctions = {
    ConstantNode: function (node) {
      var num = Number(node.value);
      return `vec2(${num.toFixed(10)},0.0)`;
    },

    ParenthesisNode: function (node) {
      return `(${GLcompileNode(node.content)})`;
    },

    OperatorNode: function (node) {
      switch (node.fn) {
        case "unaryPlus":
          return `(+${GLcompileNode(node.args[0])})`;
        case "unaryMinus":
          return `(-${GLcompileNode(node.args[0])})`;
        case "add":
          return `${GLcompileNode(node.args[0])}+${GLcompileNode(node.args[1])}`;
        case "subtract":
          return `${GLcompileNode(node.args[0])}-${GLcompileNode(node.args[1])}`;
        case "multiply":
          return `mulC(${GLcompileNode(node.args[0])},${GLcompileNode(node.args[1])})`;
        case "divide":
          return `divC(${GLcompileNode(node.args[0])},${GLcompileNode(node.args[1])})`;
        case "pow":
          return `powC(${GLcompileNode(node.args[0])},${GLcompileNode(node.args[1])})`;
        default:
          throw new Error("Unknown operator: " + node.fn);
      }
    },

    FunctionNode: function (node) {
      if (scope.functions[node.fn] == undefined) {
        throw new Error("Function " + node.fn + " is undefined");
      }
      return `${node.fn + "C"}(${node.args.map(GLcompileNode).join(",")})`;
    },

    SymbolNode: function (node) {
      if (!scope.variables.includes(node.name)) {
        throw new Error("Variable " + node.name + " is undefined");
      }
      return node.name;
    },

    AssignmentNode: function (node) {
      if (node.object.type != "SymbolNode") {
        throw new Error("Can only assign to variables");
      }
      if (scope.variables.includes(node.object.name)) {
        throw new Error("Variable " + node.name + " is already defined");
      }
      return `vec2 ${node.object.name} = ${GLcompileNode(node.value)};`;
    },
  }

  return compileFunctions[node.type](node);
}*/