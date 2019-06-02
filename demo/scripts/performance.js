const {SN, TX, C, TS, SA, REF, DN, EVD, DV, SV, IF, H, MP, DA, EAD, EH, HIF, HB, HM, HC} = Drizzle.factory
const {Application, ComponentTemplate, ViewTemplate} = Drizzle

const cache = {}

const c1 = SN('c1', 'div')
SA(c1, 'class', 'container')

const c2 = SN('c2', 'div')
SA(c2, 'class', 'jumbotron')

const c3 = SN('c3', 'div')
SA(c3, 'class', 'row')

const c4 = SN('c4', 'div')
SA(c4, 'class', 'col-md-6')

const c5 = SN('c5', 'div')
SA(c5, 'class', 'col-md-6')

const c6 = SN('c6', 'h1')
const c7 = TX('c7', [0, 'DrizzleJs (non-keyed)'])

const c8 = SN('c8', 'span')
SA(c4, 'class', 'preloadicon glyphicon glyphicon-remove')

const c9 = REF('c9', false, 'operators')
const c10 = REF('c10', true, 'list')

C(c5, c9)
C(c6, c7)
C(c4, c6)

C(c3, c4, c5)
C(c2, c3)
C(c1, c2, c10, c8)

const index = new ComponentTemplate(TS(c1))
index.tag(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10)

cache['app/demo/index'] = {
    template: index,
    items: { views: ['operators', 'list'] },
    store: {
        models: {
            items: {
                data: () => []
            }
        },

        actions: {

        }
    }
}

const v11 = SN('v11', 'div')
SA(v11, 'class', 'row')

const v12 = SN('v12', 'div')
SA(v12, 'class', 'col-sm-6 smallpad')
const v13 = DN('v13', 'button', ['e1'])
SA(v13, 'class', 'btn btn-primary btn-block')
const v14 = TX('v14', [0, 'Create 1,000 rows'])
C(v13, v14)
C(v12, v13)

const v15 = SN('v15', 'div')
SA(v15, 'class', 'col-sm-6 smallpad')
const v16 = DN('v16', 'button', ['e2'])
SA(v16, 'class', 'btn btn-primary btn-block')
const v17 = TX('v17', [0, 'Create 10,000 rows'])
C(v16, v17)
C(v15, v16)

const v18 = SN('v18', 'div')
SA(v18, 'class', 'col-sm-6 smallpad')
const v19 = DN('v19', 'button', ['e3'])
SA(v19, 'class', 'btn btn-primary btn-block')
const v110 = TX('v110', [0, 'Append 1,000 rows'])
C(v19, v110)
C(v18, v19)

const v111 = SN('v111', 'div')
SA(v111, 'class', 'col-sm-6 smallpad')
const v112 = DN('v112', 'button', ['e4'])
SA(v112, 'class', 'btn btn-primary btn-block')
const v113 = TX('v113', [0, 'Update every 10th row'])
C(v112, v113)
C(v111, v112)

const v114 = SN('v114', 'div')
SA(v114, 'class', 'col-sm-6 smallpad')
const v115 = DN('v115', 'button', ['e5'])
SA(v115, 'class', 'btn btn-primary btn-block')
const v116 = TX('v116', [0, 'Clear'])
C(v115, v116)
C(v114, v115)

const v117 = SN('v117', 'div')
SA(v117, 'class', 'col-sm-6 smallpad')
const v118 = DN('v118', 'button', ['e6'])
SA(v118, 'class', 'btn btn-primary btn-block')
const v119 = TX('v119', [0, 'Swap Rows'])
C(v118, v119)
C(v117, v118)

C(v11, v12, v15, v18, v111, v114, v117)

const operators = new ViewTemplate(TS(v11))
operators.tag(v11, v12, v13, v14, v15, v16, v17, v18, v19, v110, v111, v112, v113, v114, v115, v116, v117, v118, v119)
EVD(operators, 'e1', 'click', 'run', true)
EVD(operators, 'e2', 'click', 'runLots', true)
EVD(operators, 'e3', 'click', 'add', true)
EVD(operators, 'e4', 'click', 'update', true)
EVD(operators, 'e5', 'click', 'clear', true)

cache['app/demo/operators'] = {
    template: operators
}

const v21 = SN('v21', 'table')
SA(v21, 'class', 'table table-hover table-striped test-data')
const v22 = SN('v22', 'tbody')

const v23 = DN('v23', 'tr')
DA(v23, 'class', 'h2')

const v24 = SA('v24', 'td')
SA(v21, 'class', 'col-md-1')


C(v21, v22)
const list = new ViewTemplate(TS(v21))
list.tag(v21)

HB(list, 'h1', DV('item.id'), SV('=='), DV('selected'))
HIF(list, 'h2', 'h1', SV('danger'))
H(list, 'h3', DV('item.id'))
H(list, 'h4', DV('item.label'))

const app = new Application({
    container: document.body,
    entry: 'demo',
    getResource (file, comp) {
        return Promise.resolve(cache[file])
    }
})

app.start()
