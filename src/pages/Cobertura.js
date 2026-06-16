import { useState } from "react";
import { coberturaApi } from "../services/api";

export default function Cobertura() {
  const [paciente, setPaciente] = useState("");
  const [procedimento, setProcedimento] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [consultando, setConsultando] = useState(false);

  async function validar(e) {
    e.preventDefault();
    setConsultando(true);
    setErro("");
    setResultado(null);
    try {
      const r = await coberturaApi.validar(paciente, procedimento);
      setResultado(r.data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setConsultando(false);
    }
  }

  const cor =
    resultado?.cobertura === "TOTAL"
      ? "bg-green-50 border-green-200 text-green-800"
      : resultado?.cobertura === "PARCIAL"
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : "bg-slate-50 border-slate-200 text-slate-700";

  return (
    <div className="max-w-xl">
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-brand-700 mb-1">
          Validar cobertura
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Verifica se um procedimento é coberto pelo plano do paciente. Usado
          por Faturamento (G10) e Autorização (G13).
        </p>

        <form onSubmit={validar} className="space-y-4">
          <input
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            placeholder="ID do paciente"
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            required
          />
          <input
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            placeholder="Código do procedimento (ex: CONSULTA_CLINICA)"
            value={procedimento}
            onChange={(e) => setProcedimento(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={consultando}
            className="bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-800 disabled:opacity-50"
          >
            {consultando ? "Verificando..." : "Verificar cobertura"}
          </button>
        </form>

        {erro && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {resultado && (
          <div className={`mt-4 border rounded-md p-4 ${cor}`}>
            <p className="font-semibold text-base mb-1">
              Cobertura: {resultado.cobertura} ({resultado.percentual}%)
            </p>
            <p className="text-sm">
              Plano: {resultado.plano} · Procedimento: {resultado.procedimento}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
