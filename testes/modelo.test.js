const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando o cadastro de duas respostas', () => {
  modelo.cadastrar_pergunta('Por que?');
  const perguntas = modelo.listar_perguntas();
  const id = perguntas[0].id_pergunta;
  modelo.cadastrar_resposta(id, 'Nao sei');
  modelo.cadastrar_resposta(id, '42');
  const respostas = modelo.get_respostas(id);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('Nao sei');
  expect(respostas[1].texto).toBe('42');
})

test('Testando o método de recuperar pergunta', () => {
  modelo.cadastrar_pergunta('Nova pergunta');
  const perguntas = modelo.listar_perguntas();
  const id = perguntas[0].id_pergunta;
  const pergunta = modelo.get_pergunta(id);
  expect(perguntas[0]).toBe(pergunta);
});
