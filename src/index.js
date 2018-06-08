'use babel'

const BRITISH_TO_AMERICAN = {

	// is vs iz
	'apologis': 'apologiz',
	'colouris': 'coloriz',
	'energis': 'energiz',
	'organis': 'organiz',
	'practis': 'practic',
	'recognis': 'recogniz',
	'theoris': 'theoriz',

	// ll vs l
	'fuell': 'fuel',
	'handfull': 'handful',
	'travell': 'travel',

	// nc vs ns
  'defenc': 'defens',

	// ogue vs og
	'analogue': 'analog',
	'catalogue': 'catalog',

	// our vs or
	'armour': 'armor',
	'behaviour': 'behavior',
	'colour': 'color',
	'demeanour': 'demeanor',
	'favour': 'favor',
	'fervour': 'fervor',
	'flavour': 'flavor',
	'harbour': 'harbor',
	'honour': 'honor',
	'humour': 'humor',
	'labour': 'labor',
	'neighbour': 'neighbor',
	'rumour': 'rumor',
	'savour': 'savor',
	'splendour': 'splendor',
	'vapour': 'vapor',
	'vigour': 'vigor',

	// re vs er
	'calibre': 'caliber',
	'centre': 'center',
	'fibre': 'fiber',
	'goitre': 'goiter',
	'litre': 'liter',
	'lustre': 'luster',
	'maneuvre': 'maneuver',
	'manoeuvre': 'maneuver',
	'meagre': 'meager',
	'metre': 'meter',
	'mitre': 'miter',
	'nitre': 'niter',
	'saltpetre': 'saltpeter',
	'sepulchre': 'sepulcher',
	'sombre': 'somber',
	'spectre': 'specter',
	'theatre': 'theater',

	// ys vs yz
	'analys': 'analyz',
	'catalys': 'catalyz',
	'hydrolys': 'hydrolyz',
	'paralys': 'paralyz',

	// miscellaneous differences
  'aluminium': 'aluminum',
	'anticlockwise': 'counterclockwise',
	'oesophagus': 'esophagus',
	'programme': 'program',
	'storey': 'story',
	'tonne': 'ton',
	'femmecum': 'femcum',

};

export function activate() {
}

export function deactivate() {
}

export function provideLinter() {
  return {
    name: 'Linter Flexible Survival',
    scope: 'file',
    lintsOnChange: true,
    grammarScopes: ['source.inform7'],
    lint(textEditor) {
      const filePath = textEditor.getPath();
      const text = textEditor.getText();
      if (!filePath || text.length === 0) {
        return [];
      }

      const fullTitle = textEditor.getTitle();

      // sanitize lines
      const rawLines = text.split('\n');
      const lines = rawLines.slice(0, -1).map(line => line.trimRight());
      lines.push(rawLines[rawLines.length - 1])

      let lints = [];

      const fileName = fullTitle.indexOf('.') === -1
        ? fullTitle
        : fullTitle.substr(0, fullTitle.indexOf('.'))
      const folderHierarchy = filePath.split('\\');
      const folderName = folderHierarchy[folderHierarchy.length-2];
      if (!(lines[0].includes(fileName) && lines[0].includes(folderName) && lines[0].endsWith('begins here.'))) {
        lints.push({
          severity: 'error',
          location: {
            file: filePath,
            position: [[0, 0], [0, lines[0].length+1]],
          },
          excerpt: `Your first line should be '${fileName} by ${folderName} begins here.'`,
					solutions: [{
						position: [[0, 0], [0, 0]],
						apply: () => textEditor.setText(`${fileName} by ${folderName} begins here.\n\n` + text),
					}],
        });
      }

      if (lines[lines.length-2] !== `${fileName} ends here.` && lines[lines.length-1] !== `${fileName} ends here.`) {
        lints.push({
          severity: 'error',
          location: {
            file: filePath,
            position: [[lines.length-2, 0], [lines.length-2, lines[lines.length-2].length]],
          },
          excerpt: `Your last line should be '${fileName} ends here.'`,
					solutions: [{
						position: [[0, 0], [0, 0]],
						apply: () => textEditor.setText(text + `\n${fileName} ends here.`),
					}],
        });
      }

      lines.forEach((rawLine, lineIndex) => {
        const line = rawLine.trim();
        const lineStartIndex = rawLine.match(/^\s*/)[0].length;

        // TODO: check for comment at end of line
        const SEMICOLON_END_REQUIRED_STARTS = [
          'say "',
          'now',
					'let',
					'setmonster',
					'choose row',
					'LineBreak',
					'WaitLineBreak',
        ];

				for (let i = 0; i < SEMICOLON_END_REQUIRED_STARTS.length; i++) {
					const startCheck = SEMICOLON_END_REQUIRED_STARTS[i];

					if (line.startsWith(startCheck) && !(line.endsWith(';') || line.endsWith(']'))) {
	          lints.push({
	            severity: 'error',
	            location: {
	              file: filePath,
	              position: [[lineIndex, rawLine.length-1], [lineIndex, rawLine.length]],
	            },
	            excerpt: `All '${startCheck}' commands must end in a semicolon ';'`,
							solutions: [{
								position: [[lineIndex, rawLine.length-1], [lineIndex, rawLine.length]],
								replaceWith: ';',
							}],
	          });
						break;
	        }
				}

        if (line.startsWith('say "  ')) {
					const numSpaces = line.substr(5).match(/^\s*/)[0].length;
					if (numSpaces !== 5) {
						lints.push({
	            severity: 'warning',
	            location: {
	              file: filePath,
	              position: [[lineIndex, lineStartIndex + 5], [lineIndex, lineStartIndex + numSpaces + 5]],
	            },
							solutions: [{
								position: [[lineIndex, lineStartIndex + 5], [lineIndex, lineStartIndex + numSpaces + 5]],
								replaceWith: '     ',
							}],
	            excerpt: `Paragraph indentation should be exactly 5 spaces`,
	          });
					}
        }

        if (line.startsWith('otherwise')) {
          lints.push({
            severity: 'error',
            location: {
              file: filePath,
              position: [[lineIndex, lineStartIndex], [lineIndex, lineStartIndex + 9]],
            },
            excerpt: `Use 'else' instead of otherwise.`,
						solutions: [{
							position: [[lineIndex, lineStartIndex], [lineIndex, lineStartIndex + 9]],
							replaceWith: 'else',
						}],
          });
        }

        for (const britishWord in BRITISH_TO_AMERICAN) {
          const indexOfBritishInvasion = rawLine.indexOf(britishWord);
          if (indexOfBritishInvasion !== -1) {
            const americanWord = BRITISH_TO_AMERICAN[britishWord];
            lints.push({
              severity: 'warning',
              location: {
                file: filePath,
                position: [[lineIndex, indexOfBritishInvasion], [lineIndex, indexOfBritishInvasion + britishWord.length]],
              },
              excerpt: `Prefer the American spelling '${americanWord}' instead of British '${britishWord}'`,
              solutions: [{
								position: [[lineIndex, indexOfBritishInvasion], [lineIndex, indexOfBritishInvasion + britishWord.length]],
								replaceWith: americanWord,
              }],
            });
          }
        }

				const impregMatch = rawLine.match(/\[m?impregchance\]/);
        if (impregMatch !== null) {
					if (text.match(/setmonster/) === null) {
						lints.push({
	            severity: 'info',
	            location: {
	              file: filePath,
	              position: [[lineIndex, impregMatch.index], [lineIndex, impregMatch.index + impregMatch[0].length]],
	            },
	            excerpt: `You will probably need 'setmonster' somewhere in this file for impreg to work.`,
	          });
					}
        }
      })

      return lints;
    }
  }
}
