'use babel'

const BRITISH_TO_AMERICAN = {

	// is vs iz
	'apologis': 'apologiz',
	'colouris': 'coloriz',
	'energis': 'energiz',
	'organis': 'organiz',
	'practis': 'practic',
	'realise': 'realize',
	'realising': 'realizing',
	'recognis': 'recogniz',
	'sympathis': 'sympathiz',
	'specialise': 'specialize',
	'specialising': 'specializing',
	'theoris': 'theoriz',

	// ll vs l
	'fuell': 'fuel',
	'handfull': 'handful',
	'travell': 'travel',
	'signall': 'signal',

	// nc vs ns
	'defenc': 'defens',
	'converc': 'convers',

	// ogue vs og
	'analogue': 'analog',
	'catalogue': 'catalog',

	// our vs or
	'armour': 'armor',
	'behaviour': 'behavior',
	'colour': 'color',
	'demeanour': 'demeanor',
	'enamour': 'enamor',
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
	'analyse': 'analyze',
	'analysing': 'analyzing',
	'catalyse': 'catalyze',
	'catalysing': 'catalyzing',
	'emphasise': 'emphasize',
	'emphasising': 'emphasizing',
	'fantasis': 'fantasiz',
	'hydrolys': 'hydrolyz',
	'paralyse': 'paralyze',
	'paralysing': 'paralyzing',
	'socialis': 'socializ',

	// miscellaneous differences
  'aluminium': 'aluminum',
	'anticlockwise': 'counterclockwise',
	'cosy': 'cozy',
	'femmecum': 'femcum',
	'oesophagus': 'esophagus',
	'storey': 'story',

};

// General coding styles that you should not use
const CODING_STYLE_ERROR_SUPER_SUBSTITUTION = [
	[/[“”]/, '"', `Don't use Smart Quotes! Change the settings in applications like Word and LibreOffice to use regular quotes.`],
	[/[‘’]/, '\'', `Don't use Smart Quotes! Change the settings in applications like Word and LibreOffice to use regular quotes.`],
	[/[⋯…]/, '...', `Don't use Smart Ellipses! Change the settings in applications like Word and LibreOffice to use regular ellipses.`],
];

// Speech styles that you should not use
const SPEECH_STYLE_ERROR_SUPER_SUBSTITUTION = [
];

const FUNCTION_SUBSTITUTIONS = {
	'if waiterhater is 0, wait for any key;': 'WaitLineBreak;',
	'if waiterhater is 0 and hypernull is 0, LineBreak;': 'WaitLineBreak;',
	'attempttowait;': 'WaitLineBreak;',
	'	otherwise:': '	else:', // to not capture -- otherwise
	'[otherwise': '[else',
	'cocks of player > 0 and cunts of player > 0': 'player is herm',
	'cunts of player > 0 and cocks of player > 0': 'player is herm',
	'if cocks of player > 0:': 'if player is male:',
	'if cunts of player > 0:': 'if player is female:',
	'if cocks of player > 0]': 'if player is male]',
	'if cunts of player > 0]': 'if player is female]',
	'cocks of player is 0 and cunts of player is 0': 'player is neuter',
	'cunts of player is 0 and cocks of player is 0': 'player is neuter',
	'cocks of player < 1 and cunts of player < 1': 'player is neuter',
	'cunts of player < 1 and cocks of player < 1': 'player is neuter',
	'if cocks of player is 0:': 'if player is not male:',
	'if cunts of player is 0:': 'if player is not female:',
	'if cocks of player is 0]': 'if player is not male]',
	'if cunts of player is 0]': 'if player is not female]',
	'if cocks of player > 0 or cunts of player > 0': 'if player is not neuter',
	'if cunts of player > 0 or cocks of player > 0': 'if player is not neuter',
	'if (cocks of player > 0) or (cunts of player > 0)': 'if player is not neuter',
	'if (cunts of player > 0) or (cocks of player > 0)': 'if player is not neuter',
	'if (cocks of player > 0 or cunts of player > 0)': 'if player is not neuter',
	'if (cunts of player > 0 or cocks of player > 0)': 'if player is not neuter',
};

const FUNCTION_REGEX_SUBSTITUTIONS = [
	[/if (cocks|cunts) of player =/, 'if $1 of player is'],
];

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
			const fullTitle = textEditor.getTitle();
			if (!fullTitle.includes('.i7x')) {
				return [];
			}

      const filePath = textEditor.getPath();
      const text = textEditor.getText();
      if (!filePath || text.length === 0) {
        return [];
      }

      // sanitize lines
      const rawLines = text.split('\n');
      const lines = rawLines.slice(0, -1).map(line => line.replace(/\r$/, ''));
      lines.push(rawLines[rawLines.length - 1])

      let lints = [];

      const fileName = fullTitle.substr(0, fullTitle.indexOf('.'));
			if (fileName.toLowerCase().endsWith(' for fs')) {
				const proposedFileName = fileName.substr(0, fileName.length - 7);
				lints.push({
					severity: 'error',
					location: {
						file: filePath,
						position: [[0, 0], [0, lines[0].length+1]],
					},
					excerpt: `Don't add 'for fs' in your filename. Just use '${proposedFileName}'`,
				});
			}

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
						apply: () => textEditor.setText(`${fileName} by ${folderName} begins here.\r\n\r\n` + text),
					}],
        });
      }

			if (lines.length > 2 && lines[lines.length-2] !== `${fileName} ends here.` && lines[lines.length-1] !== `${fileName} ends here.`) {
        lints.push({
          severity: 'error',
          location: {
            file: filePath,
            position: [[lines.length-2, 0], [lines.length-2, lines[lines.length-2].length]],
          },
          excerpt: `Your last line should be '${fileName} ends here.'`,
					solutions: [{
						position: [[0, 0], [0, 0]],
						apply: () => textEditor.setText(text + `\r\n${fileName} ends here.`),
					}],
        });
      }

			let lastWaitLineBreakIndex = -2;
      lines.forEach((rawLine, lineIndex) => {
        const line = rawLine.trim();
        const lineStartIndex = rawLine.match(/^\s*/)[0].length;

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

				const whitespaceAtEndOfLine = rawLine.match(/\s*$/);
        if (whitespaceAtEndOfLine[0].length > 0) {
					lints.push({
            severity: 'error',
            location: {
              file: filePath,
              position: [[lineIndex, whitespaceAtEndOfLine.index], [lineIndex, rawLine.length]],
            },
            excerpt: `Do not have random extra whitespace.`,
						solutions: [{
							position: [[lineIndex, whitespaceAtEndOfLine.index], [lineIndex, rawLine.length]],
							replaceWith: '',
						}],
          });
        }

				for (let i = 0; i < CODING_STYLE_ERROR_SUPER_SUBSTITUTION.length; i++) {
					const substitution = CODING_STYLE_ERROR_SUPER_SUBSTITUTION[i];
					const replacer = substitution[1];
					const excerpt = substitution[2];
					if (substitution[0] instanceof RegExp) {
						const regex = substitution[0];
						const match = rawLine.match(regex);
						if (match !== null) {
							lints.push({
		            severity: 'error',
		            location: {
		              file: filePath,
		              position: [[lineIndex, match.index], [lineIndex, match.index + 1]],
		            },
		            excerpt: excerpt,
								solutions: [{
									position: [[lineIndex, match.index], [lineIndex, match.index + 1]],
									replaceWith: replacer,
								}],
		          });
						}
					} else {
						const beforeText = substitution[0];
						const matchIndex = rawLine.indexOf(beforeText);
						if (matchIndex !== -1) {
							lints.push({
								severity: 'error',
								location: {
									file: filePath,
									position: [[lineIndex, matchIndex], [lineIndex, matchIndex + 1]],
								},
								excerpt: excerpt,
								solutions: [{
									position: [[lineIndex, matchIndex], [lineIndex, matchIndex + 1]],
									replaceWith: replacer,
								}],
							});
						}
					}
				}

				// ALL RULES PAST THIS LINE SHOULD NOT WORK ON PURE COMMENT LINES
				if (line.startsWith('[')) {
					return;
				}

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
	              position: [[lineIndex, rawLine.length], [lineIndex, rawLine.length+1]],
	            },
	            excerpt: `All '${startCheck}' commands must end in a semicolon ';'`,
							solutions: [{
								position: [[lineIndex, rawLine.length], [lineIndex, rawLine.length+1]],
								replaceWith: ';',
							}],
	          });
						break;
	        }
				}

        if (line.startsWith('say "  ')) {
					const numSpaces = line.substr(5).match(/^ */)[0].length;
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

				if (line.startsWith('say "\t')) {
					lints.push({
            severity: 'warning',
            location: {
              file: filePath,
              position: [[lineIndex, lineStartIndex + 5], [lineIndex, lineStartIndex + 6]],
            },
						solutions: [{
							position: [[lineIndex, lineStartIndex + 5], [lineIndex, lineStartIndex + 6]],
							replaceWith: '     ',
						}],
            excerpt: `Paragraph indentation should use 5 spaces instead of tabs.`,
          });
				}

				if (line.startsWith('say "')) {
					const startQuoteIndex = rawLine.indexOf('"');
					const endQuoteIndex = rawLine.lastIndexOf('"');

					const startSpeechIndex = line.substr(5).search(/[^\s]/) + startQuoteIndex + 1;
					const speechSubstr = rawLine.substr(startSpeechIndex, endQuoteIndex - startSpeechIndex);

					// attempt to extract sentences from speech
					const sentences = [];
					let sentenceRegex = /(\.\.\.|[.?!])'? ?/g;
					let speechRegexMatch = null;
					let lastSpeechRegexMatchIndex = startSpeechIndex;
					while ((speechRegexMatch = sentenceRegex.exec(speechSubstr)) !== null) {
						 const sentence = rawLine.substr(lastSpeechRegexMatchIndex, startSpeechIndex + speechRegexMatch.index + speechRegexMatch[0].length - lastSpeechRegexMatchIndex).trim();
						 const words = sentence.toLowerCase().replace(/['.,!?-]/g, '').replace(/\s\s+/g, ' ').split(' ');
						 sentences.push({
							 sentence,
							 words,
							 index: lastSpeechRegexMatchIndex,
						 })
						 lastSpeechRegexMatchIndex = startSpeechIndex + speechRegexMatch.index + speechRegexMatch[0].length;
					}
					if (lastSpeechRegexMatchIndex !== startSpeechIndex + speechSubstr.length) {
						const sentence = rawLine.substr(lastSpeechRegexMatchIndex, endQuoteIndex - lastSpeechRegexMatchIndex).trim();
						const words = sentence.toLowerCase().replace(/['.,!?-]/g, '').replace(/\s\s+/g, ' ').split(' ');
						sentences.push({
							sentence,
							words,
							index: lastSpeechRegexMatchIndex,
						})
					}

					for (let i = 1; i < sentences.length; i++) {
						if (
							sentences[i].words.length > 0 && sentences[i-1].words.length > 0
								&& sentences[i].words[0] === sentences[i-1].words[0]
						) {
							lints.push({
								severity: 'info',
								location: {
									file: filePath,
									position: [[lineIndex, sentences[i].index], [lineIndex, sentences[i].index + sentences[i].sentence.length]],
								},
								excerpt: `Dont start sentences with the same word as the previous one.`,
							});
						}
					}

					for (let i = 0; i < SPEECH_STYLE_ERROR_SUPER_SUBSTITUTION.length; i++) {
						const substitution = SPEECH_STYLE_ERROR_SUPER_SUBSTITUTION[i];
						const replacer = substitution[1];
						const excerpt = substitution[2];
						if (substitution[0] instanceof RegExp) {
							const regex = substitution[0];
							const match = rawLine.match(regex);
							if (match !== null) {
								lints.push({
			            severity: 'error',
			            location: {
			              file: filePath,
			              position: [[lineIndex, match.index], [lineIndex, match.index + 1]],
			            },
			            excerpt: excerpt,
									solutions: [{
										position: [[lineIndex, match.index], [lineIndex, match.index + 1]],
										replaceWith: replacer,
									}],
			          });
							}
						} else {
							const beforeText = substitution[0];
							const matchIndex = rawLine.indexOf(beforeText);
							if (matchIndex !== -1) {
								lints.push({
									severity: 'error',
									location: {
										file: filePath,
										position: [[lineIndex, matchIndex], [lineIndex, matchIndex + 1]],
									},
									excerpt: excerpt,
									solutions: [{
										position: [[lineIndex, matchIndex], [lineIndex, matchIndex + 1]],
										replaceWith: replacer,
									}],
								});
							}
						}
					}
				}

				const impregMatch = rawLine.match(/\[m?impregchance\]/);
        if (impregMatch !== null) {
					if (text.match(/(setmonster|Choose a blank row from Table of random critters)/) === null) {
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

				if (line.indexOf('"') !== -1) {
					const doubleSpaceMatch = rawLine.match(/[.?!']  /);
	        if (doubleSpaceMatch !== null) {
						lints.push({
	            severity: 'warning',
	            location: {
	              file: filePath,
	              position: [[lineIndex, doubleSpaceMatch.index + 1], [lineIndex, doubleSpaceMatch.index + doubleSpaceMatch[0].length]],
	            },
	            excerpt: `Use single spaces after punctuation.`,
							solutions: [{
								position: [[lineIndex, doubleSpaceMatch.index + 1], [lineIndex, doubleSpaceMatch.index + doubleSpaceMatch[0].length]],
								replaceWith: ' ',
							}],
	          });
	        }
				}

        for (const beforeText in FUNCTION_SUBSTITUTIONS) {
					const beforeTextIndex = rawLine.indexOf(beforeText);
					if (beforeTextIndex !== -1) {
						const afterText = FUNCTION_SUBSTITUTIONS[beforeText];
            lints.push({
              severity: 'warning',
              location: {
                file: filePath,
                position: [[lineIndex, beforeTextIndex], [lineIndex, beforeTextIndex + beforeText.length]],
              },
              excerpt: `This style is deprecated. Please use '${afterText}' instead.`,
              solutions: [{
								position: [[lineIndex, beforeTextIndex], [lineIndex, beforeTextIndex + beforeText.length]],
								replaceWith: afterText,
              }],
            });
					}
        }

				for (let i = 0; i < FUNCTION_REGEX_SUBSTITUTIONS.length; i++) {
					const regexPair = FUNCTION_REGEX_SUBSTITUTIONS[i];
					const beforeRegex = regexPair[0];
					const beforeRegexMatch = rawLine.match(beforeRegex);
					if (beforeRegexMatch !== null) {
						const afterRegex = regexPair[1];
						const afterText =beforeRegexMatch[0].replace(beforeRegex, afterRegex)
            lints.push({
              severity: 'warning',
              location: {
                file: filePath,
                position: [[lineIndex, beforeRegexMatch.index], [lineIndex, beforeRegexMatch.index + beforeRegexMatch[0].length]],
              },
              excerpt: `This style is deprecated. Please use '${afterText}' instead.`,
              solutions: [{
								position: [[lineIndex, beforeRegexMatch.index], [lineIndex, beforeRegexMatch.index + beforeRegexMatch[0].length]],
								replaceWith: afterText,
              }],
            });
					}
        }

				const waitLineBreakIndex = rawLine.indexOf('WaitLineBreak;');
				if (waitLineBreakIndex !== -1) {
					if (lineIndex - lastWaitLineBreakIndex <= 2) {
						lints.push({
							severity: 'warning',
							location: {
								file: filePath,
								position: [[lastWaitLineBreakIndex, waitLineBreakIndex], [lineIndex, waitLineBreakIndex + 14]],
							},
							excerpt: `Put more content between waits.`,
						});
					}
					lastWaitLineBreakIndex = lineIndex;
				}

      });

      return lints;
    }
  }
}
