export interface SolcCompiledOutput {
  contracts: Contracts;
  sources: Record<string, Source>;
}

/**
 * Compile target .sol to source named "default"
 * Input may have multiple .sol to compile, so defined default or string here
 */
type Contracts = Record<'default' | string, Contract>;

/**
 * Contract name corresponding to a contract content
 * Each .sol compiled may have multiple contract
 */
type Contract = Record<string, ContractContent>;

type External = Record<string, string>;

interface Source {
  ast: SourceAst;
  id: number;
}

interface SourceAst {
  absolutePath: string;
  exportedSymbols: SourceAstExportedSymbols;
  id: number;
  license: string;
  nodeType: string;
  nodes: SourceAstNode[];
  src: string;
}

interface Node {
  body: Body;
  functionSelector: string;
  id: number;
  implemented: boolean;
  kind: string;
  modifiers: any[];
  name: string;
  nameLocation: string;
  nodeType: string;
  parameters: NodeParameters;
  returnParameters: ReturnParameters;
  scope: number;
  src: string;
  stateMutability: string;
  virtual: boolean;
  visibility: string;
}

interface SourceAstNode {
  id: number;
  literals?: string[];
  nodeType: string;
  src: string;
  abstract?: boolean;
  baseContracts?: any[];
  canonicalName?: string;
  contractDependencies?: any[];
  contractKind?: string;
  fullyImplemented?: boolean;
  linearizedBaseContracts?: number[];
  name?: string;
  nameLocation?: string;
  nodes?: Node[];
  scope?: number;
  usedErrors?: any[];
  usedEvents?: any[];
}

interface ReturnParameters {
  id: number;
  nodeType: string;
  parameters: Parameters[];
  src: string;
}

interface Parameters {
  constant: boolean;
  id: number;
  mutability: string;
  name: string;
  nameLocation: string;
  nodeType: string;
  scope: number;
  src: string;
  stateVariable: boolean;
  storageLocation: string;
  typeDescriptions: TypeDescriptions;
  typeName: TypeName;
  visibility: string;
}

interface TypeName {
  id: number;
  name: string;
  nodeType: string;
  src: string;
  typeDescriptions: TypeDescriptions;
}

interface NodeParameters {
  id: number;
  nodeType: string;
  parameters: any[];
  src: string;
}

interface Body {
  id: number;
  nodeType: string;
  src: string;
  statements: Statement[];
}

interface Statement {
  expression: StatementExpression;
  functionReturnParameters: number;
  id: number;
  nodeType: string;
  src: string;
}

interface StatementExpression {
  hexValue: string;
  id: number;
  isConstant: boolean;
  isLValue: boolean;
  isPure: boolean;
  kind: string;
  lValueRequested: boolean;
  nodeType: string;
  src: string;
  typeDescriptions: TypeDescriptions;
  value: string;
}

interface TypeDescriptions {
  typeIdentifier: string;
  typeString: string;
}

interface SourceAstExportedSymbols {
  HelloWorld: number[];
}

interface ContractContent {
  abi: ABI[];
  devdoc: Devdoc;
  evm: Evm;
  metadata: string;
  storageLayout: StorageLayout;
  userdoc: Devdoc;
}

interface StorageLayout {
  storage: any[];
  types?: any;
}

interface Evm {
  bytecode: Bytecode;
  deployedBytecode: DeployedBytecode;
  gasEstimates: GasEstimates;
  methodIdentifiers: External;
}

interface GasEstimates {
  creation: Creation;
  external: External;
}

interface Creation {
  codeDepositCost: string;
  executionCost: string;
  totalCost: string;
}

interface DeployedBytecode {
  functionDebugData: FunctionDebugData;
  generatedSources: GeneratedSource[];
  immutableReferences: Methods;
  linkReferences: Methods;
  object: string;
  opcodes: string;
  sourceMap: string;
}

interface GeneratedSource {
  ast: GeneratedSourcesAst;
  contents: string;
  id: number;
  language: string;
  name: string;
}

interface GeneratedSourcesAst {
  nativeSrc: string;
  nodeType: string;
  src: string;
  statements?: GeneratedSourcesAst[];
  body?: GeneratedSourcesAst;
  name?: string;
  parameters?: Variable[];
  returnVariable?: Variable;
  value?: Value;
  variables?: Variable[];
  expression?: Expression;
  condition?: Condition;
  post?: Post;
  pre?: Pre;
  functionName?: FunctionName;
  variableNames?: FunctionName[];
  arguments?: Argument;
}

interface Expression {
  arguments: Argument[];
  functionName: FunctionName;
  nativeSrc: string;
  nodeType: string;
  src: string;
}

interface Variable {
  name: string;
  nativeSrc: string;
  nodeType: string;
  src: string;
  type: string;
}

interface Value {
  kind?: string;
  nativeSrc: string;
  nodeType: string;
  src: string;
  type?: string;
  value?: string;
  arguments?: Argument[];
  functionName?: FunctionName;
}

interface FunctionName {
  name: string;
  nativeSrc: string;
  nodeType: string;
  src: string;
}

interface Argument {
  arguments?: Argument[] | FunctionName[];
  functionName?: FunctionName;
  name?: string;
  nativeSrc: string;
  nodeType: string;
  src: string;
  kind?: string;
  type?: string;
  value?: string;
}

type FunctionDebugData = Record<string, FunctionDebugDataInstance>;

interface FunctionDebugDataInstance {
  entryPoint?: any;
  id: number | null;
  parameterSlots: number;
  returnSlots: number;
}

interface Bytecode {
  functionDebugData: Methods;
  generatedSources: any[];
  linkReferences: Methods;
  object: string;
  opcodes: string;
  sourceMap: string;
}

interface Devdoc {
  kind: string;
  methods: Methods;
  version: number;
}

interface Methods {}

export interface ABI {
  inputs: any[];
  name: string;
  outputs: Output[];
  stateMutability: string;
  type: string;
}

interface Output {
  internalType: string;
  name: string;
  type: string;
}

interface Pre {
  nativeSrc: string;
  nodeType: string;
  src: string;
  statements: any[];
}

interface Post {
  nativeSrc: string;
  nodeType: string;
  src: string;
  statements: PostStatement[];
}

interface PostStatement {
  nativeSrc: string;
  nodeType: string;
  src: string;
  value: Condition;
  variableNames: FunctionName[];
}

interface Condition {
  arguments: FunctionName[];
  functionName: FunctionName;
  nativeSrc: string;
  nodeType: string;
  src: string;
}
