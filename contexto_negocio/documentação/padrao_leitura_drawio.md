# Padrão de Interpretação de Arquivos Draw.io para Agentes de IA

Este documento estabelece o protocolo para que agentes de Inteligência Artificial interpretem corretamente arquivos `.drawio` presentes neste repositório.

## 1. Natureza do Arquivo
Arquivos `.drawio` não são imagens binárias. Eles são arquivos de texto estruturados em **XML**.

## 2. Procedimento de Leitura
Para "ver" o conteúdo de um wireframe, o agente deve utilizar ferramentas de leitura de texto (como `read_file`) e não ferramentas de análise de imagem.

## 3. Decodificação dos Elementos (Tags XML)

A interpretação deve seguir o mapeamento abaixo nas tags `<mxCell>`:

### A. Identificação de Texto (`value`)
*   **Atributo:** `value="..."`
*   **Interpretação:** Representa o texto escrito dentro do componente (rótulos, títulos, anotações).
*   *Exemplo:* `<mxCell value="Botão Salvar" ...>` indica um elemento com o texto "Botão Salvar".

### B. Identificação do Tipo Visual (`style`)
*   **Atributo:** `style="..."`
*   **Interpretação:** Define a forma, ícone ou tipo do componente.
    *   `shape=mxgraph.arrows2.arrow`: Seta.
    *   `image=.../Database.png`: Ícone de Banco de Dados.
    *   `shape=mxgraph.mockup.forms.rrect`: Retângulo/Container.
    *   `shape=ellipse`: Círculo/Elipse.

### C. Identificação Espacial (`mxGeometry`)
*   **Tag Filha:** `<mxGeometry x="100" y="50" width="200" height="100" ... />`
*   **Interpretação:**
    *   `x`, `y`: Posição absoluta ou relativa. Permite inferir relações espaciais (quem está à esquerda, direita, acima, abaixo).
    *   `width`, `height`: Tamanho do elemento.

## 4. Exemplo Prático

Se o XML contém:
```xml
<mxCell value="Login" style="rounded=1;" vertex="1" parent="1">
    <mxGeometry x="10" y="10" width="100" height="40" as="geometry"/>
</mxCell>
```
**Interpretação:** Existe um botão ou retângulo arredondado com o texto "Login" no canto superior esquerdo (10,10).

---
**Regra Geral:** Sempre analise o XML cru para entender o estado atual do diagrama, detectando inclusive se o arquivo está vazio (apenas tags `<root>`).
