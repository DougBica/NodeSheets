class Aluno{

    constructor(codAluno, nome, faltas, notas){
        this._codAluno = codAluno,
        this._nome = nome,
        this._faltas = faltas,
        this._notas = notas,
        this._media = this.calculaMedia(this._notas),
        this._situacao = this.verSituacao(this._media, this._faltas),
        this._notaAprovacao = this.verNotaAprovacao (this._media),
        console.log(this)
    }

    get codAluno(){
        return this._codAluno;
    }
    get nome(){
        return this._nome;
    }
    get faltas(){
        return this._faltas;
    }
    get notas(){
        return this._notas;
    }
    get media(){
        return this._media;
    }
    get situacao(){
        return this._situacao;
    }
    get notaAprovacao(){
        return this._notaAprovacao;
    }

    calculaMedia(elem) {
        let media = parseInt(elem[0]/ 3 + elem[1]/ 3 + elem[0]/ 3);
        return media;
    }

    verSituacao(media, faltas){
        if((faltas/60)>0.25) return `Reprovado por Falta`;
        if(media < 70){
            if(media < 50) return `Reprovado por Nota`;
            return `Exame Final`;
        }else return `Aprovado`;
    }

    verNotaAprovacao(){
        if(this._situacao == `Exame Final`) return 100 - this._media
        return 0;
    }
}
module.exports = Aluno;
