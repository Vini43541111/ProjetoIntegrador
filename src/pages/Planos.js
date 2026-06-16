import { useState, useEffect } from "react";
import { planosApi } from "../services/api";

export default function Planos() {
  const [planos, setPlanos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({ nome: "", tipo: "", validade: "" });
  const [regras, setRegras] = useState([
    { procedimento: "", tipo_cobertura: "TOTAL", percentual: 100 },
  ]);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const resp = await planosApi.listar();
      setPlanos(resp.data || []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function atualizarRegra(i, campo, valor) {
    const novas = [...regras];
    novas[i][campo] = valor;
    setRegras(novas);
  }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      await planosApi.cadastrar({ ...form, regras });
      setForm({ nome: "", tipo: "", validade: "" });
      setRegras([{ procedimento: "", tipo_cobertura: "TOTAL", percentual: 100 }]);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function mudarStatus(id, statusAtual) {
    const novo = statusAtual === "ATIVO" ? "INATIVO" : "ATIVO";
    try {
      await planosApi.alterarStatus(id, novo);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-brand-700 mb-4">
          Cadastrar plano
        </h2>
        <form onSubmit={salvar} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
              placeholder="Nome do plano"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
            <input
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
              placeholder="Tipo (ex: INDIVIDUAL)"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              required
            />
            <input
              type="date"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
              value={form.validade}
              onChange={(e) => setForm({ ...form, validade: e.target.value })}
              required
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Regras de cobertura
            </p>
            <div className="space-y-2">
              {regras.map((r, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Procedimento"
                    value={r.procedimento}
                    onChange={(e) =>
                      atualizarRegra(i, "procedimento", e.target.value)
                    }
                  />
                  <select
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                    value={r.tipo_cobertura}
                    onChange={(e) =>
                      atualizarRegra(i, "tipo_cobertura", e.target.value)
                    }
                  >
                    <option value="TOTAL">TOTAL</option>
                    <option value="PARCIAL">PARCIAL</option>
                    <option value="INEXISTENTE">INEXISTENTE</option>
                  </select>
                  <input
                    type="number"
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Percentual"
                    value={r.percentual}
                    onChange={(e) =>
                      atualizarRegra(i, "percentual", Number(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setRegras([
                  ...regras,
                  { procedimento: "", tipo_cobertura: "TOTAL", percentual: 100 },
                ])
              }
              className="mt-2 text-sm text-brand-600 hover:underline"
            >
              + Adicionar regra
            </button>
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <button
            type="submit"
            disabled={salvando}
            className="bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-800 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Cadastrar plano"}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-brand-700 mb-4">
          Planos cadastrados
        </h2>
        {carregando ? (
          <p className="text-sm text-slate-500">Carregando...</p>
        ) : planos.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum plano cadastrado ainda. Cadastre o primeiro acima.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Validade</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Regras</th>
                  <th className="py-2">Ação</th>
                </tr>
              </thead>
              <tbody>
                {planos.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{p.nome}</td>
                    <td className="py-2 pr-4">{p.tipo}</td>
                    <td className="py-2 pr-4">{p.validade}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.status === "ATIVO"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-slate-500">
                      {p.regras ? p.regras.length : 0}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => mudarStatus(p.id, p.status)}
                        className="text-xs text-brand-600 hover:underline"
                      >
                        {p.status === "ATIVO" ? "Desativar" : "Ativar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
