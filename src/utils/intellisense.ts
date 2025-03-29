export const loadIntellisense = async (monaco: any): Promise<void> => {
  try {
    const docs = await (
      await fetch('https://raw.githubusercontent.com/Insalad/monacoshit/refs/heads/main/blah')
    ).json()

    const addIntellisense = (label: string, type: string, description: string, insert: string) => {
      monaco.languages.registerCompletionItemProvider('lua', {
        provideCompletionItems: () => {
          return {
            suggestions: [
              {
                label,
                kind: monaco.languages.CompletionItemKind[type],
                documentation: description,
                insertText: insert
              }
            ]
          }
        }
      })
    }

    // Add completions from docs
    for (const prop in docs) {
      for (const item in docs[prop]) {
        const document = docs[prop][item]
        addIntellisense(document.label, document.type, document.description, document.insert)
      }
    }

    // Add keywords
    const keywords = [
      '_G',
      '_VERSION',
      'Enum',
      'game',
      'plugin',
      'shared',
      'script',
      'workspace',
      'DebuggerManager',
      'elapsedTime',
      'LoadLibrary',
      'PluginManager',
      'settings',
      'tick',
      'time',
      'typeof',
      'UserSettings'
    ]
    keywords.forEach((key) => addIntellisense(key, 'Keyword', key, key))

    // Add variables
    const variables = [
      'and',
      'break',
      'do',
      'else',
      'elseif',
      'end',
      'false',
      'for',
      'function',
      'if',
      'in',
      'local',
      'nil',
      'not',
      'or',
      'repeat',
      'return',
      'then',
      'true',
      'until',
      'while'
    ]
    variables.forEach((key) => addIntellisense(key, 'Variable', key, key))

    // Add methods
    const methods = [
      'math.abs',
      'math.acos',
      'math.asin',
      'math.atan',
      'math.atan2',
      'math.ceil',
      'math.cos',
      'math.cosh',
      'math.deg',
      'math.exp',
      'math.floor',
      'math.fmod',
      'math.frexp',
      'math.huge',
      'math.ldexp',
      'math.log',
      'math.max',
      'math.min',
      'math.modf',
      'math.pi',
      'math.pow',
      'math.rad',
      'math.random',
      'math.randomseed',
      'math.sin',
      'math.sinh',
      'math.sqrt',
      'math.tan',
      'math.tanh',
      'table.concat',
      'table.foreach',
      'table.foreachi',
      'table.sort',
      'table.insert',
      'table.remove',
      'Color3.new',
      'Instance.new',
      'BrickColor.new',
      'Vector3.new',
      'Vector2.new',
      'debug.gethook',
      'debug.getinfo',
      'debug.getlocal',
      'debug.getmetatable',
      'debug.getregistry',
      'debug.getupvalue',
      'debug.getuservalue',
      'debug.sethook',
      'debug.setlocal',
      'debug.setmetatable',
      'debug.setupvalue',
      'debug.setuservalue',
      'debug.traceback',
      'debug.upvalueid',
      'debug.upvaluejoin',
      'string.byte',
      'string.char',
      'string.dump',
      'string.find',
      'string.format',
      'string.gmatch',
      'string.gsub',
      'string.len',
      'string.lower',
      'string.match',
      'string.rep',
      'string.reverse',
      'string.sub',
      'string.upper',
      'coroutine.create',
      'coroutine.resume',
      'coroutine.running',
      'coroutine.status',
      'coroutine.wrap',
      'coroutine.yield'
    ]
    methods.forEach((key) => addIntellisense(key, 'Method', key, key))

    // Add classes
    const classes = [
      'Drawing',
      'debug',
      'Instance',
      'Color3',
      'Vector3',
      'Vector2',
      'BrickColor',
      'math',
      'table',
      'string',
      'coroutine',
      'Humanoid',
      'ClickDetector',
      'LocalScript',
      'Model',
      'ModuleScript',
      'Mouse',
      'Part',
      'Player',
      'Script',
      'Tool',
      'RunService',
      'UserInputService',
      'Workspace'
    ]
    classes.forEach((key) => addIntellisense(key, 'Class', key, key))

    // Add functions
    const functions = [
      'print',
      'warn',
      'wait',
      'info',
      'printidentity',
      'assert',
      'collectgarbage',
      'error',
      'getfenv',
      'getmetatable',
      'setmetatable',
      'ipairs',
      'loadfile',
      'loadstring',
      'newproxy',
      'next',
      'pairs',
      'pcall',
      'spawn',
      'rawequal',
      'rawget',
      'rawset',
      'select',
      'tonumber',
      'tostring',
      'type',
      'unpack',
      'xpcall',
      'delay',
      'stats',
      ':Remove()',
      ':BreakJoints()',
      ':GetChildren()',
      ':FindFirstChild()',
      ':FireServer()',
      ':InvokeServer()',
      ':ClearAllChildren()',
      ':Clone()',
      ':Destroy()',
      ':FindFirstAncestor()',
      ':FindFirstAncestorOfClass()',
      ':FindFirstAncestorWhichIsA()',
      ':FindFirstChildOfClass()',
      ':FindFirstChildWhichIsA()',
      ':GetDebugId()',
      ':GetDescendants()',
      ':GetFullName()',
      ':IsA()',
      ':GetPropertyChangedSignal()',
      ':IsAncestorOf()',
      ':IsDescendantOf()',
      ':WaitForChild()',
      ':Connect()',
      ':AncestryChanged()',
      ':Changed()',
      ':ChildAdded()',
      ':ChildRemoved()',
      ':DescendantAdded()',
      ':DescendantRemoving()',
      ':GetService()',
      ':GetObjects()',
      ':HttpGet()',
      ':Wait()'
    ]
    functions.forEach((key) =>
      addIntellisense(key, 'Function', key, key.includes(':') ? key.substring(1) : key)
    )

    // Add properties
    const properties = [
      'Visible',
      'Color',
      'Transparency',
      'Thickness',
      'From',
      'To',
      'Text',
      'Size',
      'Center',
      'Outline',
      'OutlineColor',
      'Position',
      'TextBounds',
      'Font',
      'Data',
      'Rounding',
      'NumSides',
      'Radius',
      'Filled',
      'PointA',
      'PointB',
      'PointC',
      'PointD'
    ]
    properties.forEach((key) =>
      addIntellisense(key, 'Property', 'Property for Drawing Library', key)
    )
  } catch (error) {
    console.error('Failed to load intellisense:', error)
  }
}
