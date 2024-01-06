# Brainfuck Interpreter in TuffScript

A Brainfuck Interpreter written in TuffScript.

## Quick Start

1.  Run in the root directory:

    `yarn start`

2.  Input your Brainfuck code or try "Hello, World!":

    `++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.`

3.  To transpile the interpreter to Node.js, run the following command:
    `yarn build`

### Limitations

Currently, the interpreter has some limitations due to recursion usage. TuffScript under the hood does not optimize recursion, which may affect performance and stack size for complex Brainfuck programs.

// TODO: Optimize recursion handling in the interpreter to improve performance and allow for more complex Brainfuck scripts.
