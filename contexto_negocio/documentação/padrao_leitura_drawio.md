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

---

## 5. Catálogo de Componentes Disponíveis

Abaixo está a lista de componentes presentes no wireframe `Wireframe - Wiztools.drawio`, organizados por categoria:

### A. Formas Básicas
| Componente | Style (identificador) |
|------------|----------------------|
| Retângulo arredondado | `rounded=1` |
| Retângulo | `rounded=0` |
| Quadrado | `aspect=fixed` |
| Elipse | `ellipse` |
| Círculo | `ellipse;aspect=fixed` |
| Paralelogramo | `shape=parallelogram` |
| Losango (Rhombus) | `rhombus` |
| Hexágono | `shape=hexagon` |
| Triângulo | `triangle` |
| Cilindro | `shape=cylinder3` |
| Nuvem | `ellipse;shape=cloud` |
| Documento | `shape=document` |
| Fita (Tape) | `shape=tape` |
| Trapézio | `shape=trapezoid` |
| Passo (Step) | `shape=step` |
| Cubo | `shape=cube` |
| Armazenamento Interno | `shape=internalStorage` |
| Nota | `shape=note` |
| Cartão | `shape=card` |
| Callout | `shape=callout` |
| Processo | `shape=process` |

### B. Formas Especiais e Fluxogramas
| Componente | Style (identificador) |
|------------|----------------------|
| XOR | `shape=xor` |
| OR | `shape=or` |
| Armazenamento de Dados | `shape=dataStorage` |
| Entrada Manual | `shape=manualInput` |
| Limite de Loop | `shape=loopLimit` |
| Conector Off-Page | `shape=offPageConnector` |
| Delay | `shape=delay` |
| Display | `shape=display` |
| Fita de Dados | `shape=tapeData` |
| Collate | `shape=collate` |
| Sort | `shape=sortShape` |
| Switch | `shape=switch` |

### C. Setas e Conectores
| Componente | Style (identificador) |
|------------|----------------------|
| Seta simples | `endArrow=classic` |
| Seta bidirecional | `endArrow=classic;startArrow=classic` |
| Seta curva | `curved=1;endArrow=classic` |
| Seta flexível | `shape=flexArrow` |
| Seta flexível bidirecional | `shape=flexArrow;endArrow=classic;startArrow=classic` |
| Linha tracejada | `endArrow=none;dashed=1` |
| Linha pontilhada | `dashPattern=1 3` |
| Linha sólida | `endArrow=none` |
| Seta única (direções) | `shape=singleArrow;direction=north/south/east/west` |
| Seta dupla | `shape=doubleArrow` |
| Edge isométrico | `edgeStyle=isometricEdgeStyle` |
| Edge segmentado | `edgeStyle=segmentEdgeStyle` |
| Edge ortogonal | `edgeStyle=orthogonalEdgeStyle` |
| Edge cotovelo | `edgeStyle=elbowEdgeStyle` |

### D. Containers e Layouts
| Componente | Style (identificador) |
|------------|----------------------|
| Swimlane (Container simples) | `swimlane;startSize=0` |
| Container Vertical | `swimlane` |
| Container Horizontal | `swimlane;horizontal=0` |
| Pool com Lanes | `swimlane;childLayout=stackLayout` |
| Cross-Functional Flowchart | `shape=table;childLayout=tableLayout` |
| Tree Container | `containerType=tree` |
| Vertical Tree Layout | `childLayout=treeLayout;horizontalTree=0` |
| Horizontal Tree Layout | `childLayout=treeLayout;horizontalTree=1` |
| Vertical Flow Layout | `childLayout=flowLayout;flowOrientation=north` |
| Horizontal Flow Layout | `childLayout=flowLayout;flowOrientation=west` |
| Orgchart | `containerType=tree` + `edgeStyle=elbowEdgeStyle` |
| Mindmap | `containerType=tree` + `edgeStyle=entityRelationEdgeStyle` |

### E. Tabelas e Listas
| Componente | Style (identificador) |
|------------|----------------------|
| Tabela com título | `shape=table;startSize=30` |
| Tabela sem título | `shape=table;startSize=0` |
| Linha de tabela | `shape=tableRow` |
| Célula de tabela | `shape=partialRectangle` |
| Lista com cabeçalho | `swimlane;childLayout=stackLayout` |
| Item de lista | `text;strokeColor=none;fillColor=none` |

### F. Texto e Títulos
| Componente | Style (identificador) |
|------------|----------------------|
| Texto simples | `text` |
| Título (Heading) | `text;fontSize=24;fontStyle=1` |
| Bloco de texto com HTML | `text;html=1;whiteSpace=wrap` |
| Lista não ordenada | `<ul><li>` dentro de `value` |
| Lista ordenada | `<ol><li>` dentro de `value` |
| Link | `UserObject` com `link="url"` |

### G. Símbolos UML e Diagramação
| Componente | Style (identificador) |
|------------|----------------------|
| Actor UML | `shape=umlActor` |
| Actor genérico | `shape=actor` |
| Elipse dupla | `ellipse;shape=doubleEllipse` |
| Retângulo duplo | `shape=ext;double=1` |
| Or Ellipse | `shape=orEllipse` |
| Sum Ellipse | `shape=sumEllipse` |
| Line Ellipse | `shape=lineEllipse` |

### H. Ícones e Imagens
| Componente | Style (identificador) |
|------------|----------------------|
| Imagem/Clipart | `shape=image;image=img/clipart/...` |
| Ícone com label | `icon;image=...` |
| Label com imagem | `label;image=...` |

### I. Formas Decorativas e Auxiliares
| Componente | Style (identificador) |
|------------|----------------------|
| Chave (Curly Bracket) | `shape=curlyBracket` |
| Linha horizontal | `line` |
| Linha vertical | `line;direction=south` |
| Backbone | `perimeter=backbonePerimeter` |
| Crossbar | `shape=crossbar` |
| Waypoint | `shape=waypoint` |
| Retângulo parcial | `shape=partialRectangle` |
| Tee | `shape=tee` |
| Corner | `shape=corner` |
| Cross | `shape=cross` |
| Datastore | `shape=datastore` |

### J. Formas 3D e Isométricas
| Componente | Style (identificador) |
|------------|----------------------|
| Retângulo isométrico | `shape=isoRectangle` |
| Cubo isométrico | `shape=isoCube2` |
| Iso Cube básico | `shape=mxgraph.basic.isocube` |
| Cone | `shape=mxgraph.basic.cone` |
| Cone 2 | `shape=mxgraph.basic.cone2` |

### K. Formas Estilizadas (mxgraph.basic)
| Componente | Style (identificador) |
|------------|----------------------|
| Estrela 4 pontas | `shape=mxgraph.basic.4_point_star_2` |
| Estrela 6 pontas | `shape=mxgraph.basic.6_point_star` |
| Estrela 8 pontas | `shape=mxgraph.basic.8_point_star` |
| Nuvem retangular | `shape=mxgraph.basic.cloud_rect` |
| Cloud Callout | `shape=mxgraph.basic.cloud_callout` |
| Banner | `shape=mxgraph.basic.banner` |
| Documento estilizado | `shape=mxgraph.basic.document` |
| Gota | `shape=mxgraph.basic.drop` |
| Flash/Raio | `shape=mxgraph.basic.flash` |
| Lua | `shape=mxgraph.basic.moon` |
| Loud Callout | `shape=mxgraph.basic.loud_callout` |
| Coração | `shape=mxgraph.basic.heart` |
| Meio círculo | `shape=mxgraph.basic.half_circle` |
| Símbolo de proibido | `shape=mxgraph.basic.no_symbol` |
| Octógono | `shape=mxgraph.basic.octagon2` |
| Triângulo ortogonal | `shape=mxgraph.basic.orthogonal_triangle` |
| Triângulo agudo | `shape=mxgraph.basic.acute_triangle` |
| Triângulo obtuso | `shape=mxgraph.basic.obtuse_triangle` |
| Retângulo com corte diagonal | `shape=mxgraph.basic.diag_snip_rect` |
| Polígono customizado | `shape=mxgraph.basic.polygon` |
| Retângulo com padrão | `shape=mxgraph.basic.patternFillRect` |

### L. Estilos de Preenchimento (fillStyle)
| Estilo | Descrição |
|--------|-----------|
| `fillStyle=vert` | Linhas verticais |
| `fillStyle=hor` | Linhas horizontais |
| `fillStyle=diag` | Linhas diagonais |
| `fillStyle=diagRev` | Linhas diagonais reversas |
| `fillStyle=grid` | Grade |
| `fillStyle=diagGrid` | Grade diagonal |
| `fillStyle=dots` | Pontos |
| `fillStyle=cross-hatch` | Hachura cruzada |
| `sketch=1` | Estilo "mão livre" |

### M. Mindmap e Organogramas
| Componente | Style (identificador) |
|------------|----------------------|
| Ideia Central | `ellipse` + `treeFolding=1;treeMoving=1` |
| Tópico | `rounded=1;arcSize=50` |
| Branch | `shape=partialRectangle;bottom=1` |
| Sub Tópico | `rounded=1;arcSize=50` |
| Organization (root) | `treeRoot=1` |
| Division | `treeFolding=1;treeMoving=1` |
| Sub Section | `treeFolding=1;treeMoving=1` |

### N. Process Bar
| Componente | Style (identificador) |
|------------|----------------------|
| Process Bar Container | `swimlane;childLayout=stackLayout;horizontalStack=1` |
| Step | `shape=step;perimeter=stepPerimeter` |

### O. Setas Estilizadas (mxgraph.arrows2)
| Componente | Style (identificador) |
|------------|----------------------|
| Seta básica | `shape=mxgraph.arrows2.arrow` |
| Seta invertida (flipH) | `shape=mxgraph.arrows2.arrow;flipH=1` |
| Seta para cima | `shape=mxgraph.arrows2.arrow;direction=north` |
| Seta para baixo | `shape=mxgraph.arrows2.arrow;direction=south` |
| Seta com entalhe | `shape=mxgraph.arrows2.arrow;notch=15` |
| Seta bidirecional | `shape=mxgraph.arrows2.twoWayArrow` |
| Seta callout | `shape=mxgraph.arrows2.calloutArrow` |
| Seta afiada (sharp) | `shape=mxgraph.arrows2.sharpArrow` |
| Seta afiada 2 | `shape=mxgraph.arrows2.sharpArrow2` |
| Seta estilizada | `shape=mxgraph.arrows2.stylisedArrow` |
| Seta curvada (bend) | `shape=mxgraph.arrows2.bendArrow` |
| Seta curvada arredondada | `shape=mxgraph.arrows2.bendArrow;rounded=1` |
| Seta curvada bidirecional | `shape=mxgraph.arrows2.bendDoubleArrow` |
| Seta callout bidirecional | `shape=mxgraph.arrows2.calloutDoubleArrow` |
| Seta com cauda | `shape=mxgraph.arrows2.tailedArrow` |
| Seta com cauda entalhada | `shape=mxgraph.arrows2.tailedNotchedArrow` |
| Seta tríade | `shape=mxgraph.arrows2.triadArrow` |
| Seta quádrupla | `shape=mxgraph.arrows2.quadArrow` |
| Seta callout 90° dupla | `shape=mxgraph.arrows2.calloutDouble90Arrow` |
| Seta callout quádrupla | `shape=mxgraph.arrows2.calloutQuadArrow` |
| Seta listrada | `shape=mxgraph.arrows2.stripedArrow` |
| Seta jump in | `shape=mxgraph.arrows2.jumpInArrow` |
| Seta U-turn | `shape=mxgraph.arrows2.uTurnArrow` |
| Seta wedge | `shape=mxgraph.arrows2.wedgeArrow` |
| Seta wedge tracejada | `shape=mxgraph.arrows2.wedgeArrowDashed2` |

### P. Cliparts - Computadores
| Componente | Caminho da imagem |
|------------|-------------------|
| Antivírus | `img/lib/clip_art/computers/Antivirus_128x128.png` |
| Filtragem de Dados | `img/lib/clip_art/computers/Data_Filtering_128x128.png` |
| Banco de Dados | `img/lib/clip_art/computers/Database_128x128.png` |
| Banco de Dados (Adicionar) | `img/lib/clip_art/computers/Database_Add_128x128.png` |
| Banco de Dados (Remover) | `img/lib/clip_art/computers/Database_Minus_128x128.png` |
| Banco de Dados (Excluir) | `img/lib/clip_art/computers/Database_Remove_128x128.png` |
| Banco de Dados (Mover) | `img/lib/clip_art/computers/Database_Move_Stack_128x128.png` |
| Tablet IBM | `img/lib/clip_art/computers/IBM_Tablet_128x128.png` |
| Tablet Fujitsu | `img/lib/clip_art/computers/Fujitsu_Tablet_128x128.png` |
| HD/Disco Rígido | `img/lib/clip_art/computers/Harddrive_128x128.png` |
| iMac | `img/lib/clip_art/computers/iMac_128x128.png` |
| iPad | `img/lib/clip_art/computers/iPad_128x128.png` |
| Laptop | `img/lib/clip_art/computers/Laptop_128x128.png` |
| MacBook | `img/lib/clip_art/computers/MacBook_128x128.png` |
| Mainframe | `img/lib/clip_art/computers/Mainframe_128x128.png` |
| Rede | `img/lib/clip_art/computers/Network_128x128.png` |
| Rede 2 | `img/lib/clip_art/computers/Network_2_128x128.png` |
| Netbook | `img/lib/clip_art/computers/Netbook_128x128.png` |
| Monitor | `img/lib/clip_art/computers/Monitor_128x128.png` |
| Monitor com Torre | `img/lib/clip_art/computers/Monitor_Tower_128x128.png` |
| Monitor com Torre (atrás) | `img/lib/clip_art/computers/Monitor_Tower_Behind_128x128.png` |
| Impressora | `img/lib/clip_art/computers/Printer_128x128.png` |
| Impressora Comercial | `img/lib/clip_art/computers/Printer_Commercial_128x128.png` |
| Sistema Seguro | `img/lib/clip_art/computers/Secure_System_128x128.png` |
| Servidor | `img/lib/clip_art/computers/Server_128x128.png` |
| Servidor Torre | `img/lib/clip_art/computers/Server_Tower_128x128.png` |
| Rack de Servidor | `img/lib/clip_art/computers/Server_Rack_128x128.png` |
| Rack de Servidor (vazio) | `img/lib/clip_art/computers/Server_Rack_Empty_128x128.png` |
| Rack de Servidor (parcial) | `img/lib/clip_art/computers/Server_Rack_Partial_128x128.png` |
| Software | `img/lib/clip_art/computers/Software_128x128.png` |
| Caneta Stylus | `img/lib/clip_art/computers/Stylus_128x128.png` |
| Touch | `img/lib/clip_art/computers/Touch_128x128.png` |
| Hub USB | `img/lib/clip_art/computers/USB_Hub_128x128.png` |
| Aplicação Virtual | `img/lib/clip_art/computers/Virtual_Application_128x128.png` |
| Máquina Virtual | `img/lib/clip_art/computers/Virtual_Machine_128x128.png` |
| Workstation | `img/lib/clip_art/computers/Workstation_128x128.png` |
| Vírus | `img/lib/clip_art/computers/Virus_128x128.png` |

### Q. Cliparts - Finanças
| Componente | Caminho da imagem |
|------------|-------------------|
| Seta para Baixo | `img/lib/clip_art/finance/Arrow_Down_128x128.png` |
| Seta para Cima | `img/lib/clip_art/finance/Arrow_Up_128x128.png` |
| Moedas | `img/lib/clip_art/finance/Coins_128x128.png` |
| Cartão de Crédito | `img/lib/clip_art/finance/Credit_Card_128x128.png` |
| Dólar | `img/lib/clip_art/finance/Dollar_128x128.png` |
| Carrinho de Compras | `img/lib/clip_art/finance/Shopping_Cart_128x128.png` |
| Cofre | `img/lib/clip_art/finance/Safe_128x128.png` |
| Cofrinho | `img/lib/clip_art/finance/Piggy_Bank_128x128.png` |
| Gráfico de Pizza | `img/lib/clip_art/finance/Pie_Chart_128x128.png` |
| Gráfico | `img/lib/clip_art/finance/Graph_128x128.png` |
| Ações em Queda | `img/lib/clip_art/finance/Stock_Down_128x128.png` |
| Ações em Alta | `img/lib/clip_art/finance/Stock_Up_128x128.png` |

### R. Cliparts - Geral
| Componente | Caminho da imagem |
|------------|-------------------|
| Bateria 0% | `img/lib/clip_art/general/Battery_0_128x128.png` |
| Bateria 50% | `img/lib/clip_art/general/Battery_50_128x128.png` |
| Bateria 75% | `img/lib/clip_art/general/Battery_75_128x128.png` |
| Bateria 100% | `img/lib/clip_art/general/Battery_100_128x128.png` |
| Bateria (todos estados) | `img/lib/clip_art/general/Battery_allstates_128x128.png` |
| Bluetooth | `img/lib/clip_art/general/Bluetooth_128x128.png` |
| Globo Terrestre | `img/lib/clip_art/general/Earth_globe_128x128.png` |
| Pasta Vazia | `img/lib/clip_art/general/Empty_Folder_128x128.png` |
| Pasta Cheia | `img/lib/clip_art/general/Full_Folder_128x128.png` |
| Engrenagem | `img/lib/clip_art/general/Gear_128x128.png` |
| Chaves | `img/lib/clip_art/general/Keys_128x128.png` |
| Cadeado | `img/lib/clip_art/general/Lock_128x128.png` |
| Ponteiro do Mouse | `img/lib/clip_art/general/Mouse_Pointer_128x128.png` |
| Plug/Tomada | `img/lib/clip_art/general/Plug_128x128.png` |
| Leme de Navio | `img/lib/clip_art/general/Ships_Wheel_128x128.png` |
| Pneu | `img/lib/clip_art/general/Tire_128x128.png` |
| Estrela | `img/lib/clip_art/general/Star_128x128.png` |

### S. Cliparts - Redes (Networking)
| Componente | Caminho da imagem |
|------------|-------------------|
| Bridge | `img/lib/clip_art/networking/Bridge_128x128.png` |
| Certificado | `img/lib/clip_art/networking/Certificate_128x128.png` |
| Certificado Inválido | `img/lib/clip_art/networking/Certificate_Off_128x128.png` |
| Nuvem | `img/lib/clip_art/networking/Cloud_128x128.png` |
| Computador na Nuvem | `img/lib/clip_art/networking/Cloud_Computer_128x128.png` |
| Computador na Nuvem (privado) | `img/lib/clip_art/networking/Cloud_Computer_Private_128x128.png` |
| Servidor na Nuvem | `img/lib/clip_art/networking/Cloud_Server_128x128.png` |
| Servidor na Nuvem (privado) | `img/lib/clip_art/networking/Cloud_Server_Private_128x128.png` |
| Rack na Nuvem | `img/lib/clip_art/networking/Cloud_Rack_128x128.png` |
| Rack na Nuvem (privado) | `img/lib/clip_art/networking/Cloud_Rack_Private_128x128.png` |
| Armazenamento na Nuvem | `img/lib/clip_art/networking/Cloud_Storage_128x128.png` |
| E-mail | `img/lib/clip_art/networking/Email_128x128.png` |
| Concentrador | `img/lib/clip_art/networking/Concentrator_128x128.png` |
| Firewall | `img/lib/clip_art/networking/Firewall_128x128.png` |
| Firewall 02 | `img/lib/clip_art/networking/Firewall_02_128x128.png` |
| Firewall (página) | `img/lib/clip_art/networking/Firewall-page1_128x128.png` |
| Servidor de Impressão | `img/lib/clip_art/networking/Print_Server_128x128.png` |
| Servidor de Impressão Wireless | `img/lib/clip_art/networking/Print_Server_Wireless_128x128.png` |
| PDU (Distribuição de Energia) | `img/lib/clip_art/networking/power_distribution_unit_128x128.png` |
| Modem | `img/lib/clip_art/networking/Modem_128x128.png` |
| Câmera IP | `img/lib/clip_art/networking/Ip_Camera_128x128.png` |
| Repetidor | `img/lib/clip_art/networking/Repeater_128x128.png` |
| Roteador | `img/lib/clip_art/networking/Router_128x128.png` |
| Ícone de Roteador | `img/lib/clip_art/networking/Router_Icon_128x128.png` |
| Switch | `img/lib/clip_art/networking/Switch_128x128.png` |
| Roteador Wireless | `img/lib/clip_art/networking/Wireless_Router_128x128.png` |
| Roteador Wireless N | `img/lib/clip_art/networking/Wireless_Router_N_128x128.png` |
| UPS (No-break) | `img/lib/clip_art/networking/UPS_128x128.png` |

### T. Cliparts - Pessoas
| Componente | Caminho da imagem |
|------------|-------------------|
| Homem de Terno | `img/lib/clip_art/people/Suit_Man_128x128.png` |
| Homem de Terno (preto) | `img/lib/clip_art/people/Suit_Man_Black_128x128.png` |
| Homem de Terno (azul) | `img/lib/clip_art/people/Suit_Man_Blue_128x128.png` |
| Homem de Terno (verde) | `img/lib/clip_art/people/Suit_Man_Green_128x128.png` |
| Homem de Terno (verde/preto) | `img/lib/clip_art/people/Suit_Man_Green_Black_128x128.png` |
| Mulher de Terno | `img/lib/clip_art/people/Suit_Woman_128x128.png` |
| Mulher de Terno (preta) | `img/lib/clip_art/people/Suit_Woman_Black_128x128.png` |
| Mulher de Terno (azul) | `img/lib/clip_art/people/Suit_Woman_Blue_128x128.png` |
| Mulher de Terno (verde) | `img/lib/clip_art/people/Suit_Woman_Green_128x128.png` |
| Mulher de Terno (verde/preto) | `img/lib/clip_art/people/Suit_Woman_Green_Black_128x128.png` |
| Trabalhador de Construção (homem) | `img/lib/clip_art/people/Construction_Worker_Man_128x128.png` |
| Trabalhador de Construção (homem/preto) | `img/lib/clip_art/people/Construction_Worker_Man_Black_128x128.png` |
| Trabalhador de Construção (mulher) | `img/lib/clip_art/people/Construction_Worker_Woman_128x128.png` |
| Trabalhador de Construção (mulher/preta) | `img/lib/clip_art/people/Construction_Worker_Woman_Black_128x128.png` |
| Médico (homem) | `img/lib/clip_art/people/Doctor_Man_128x128.png` |
| Médico (homem/preto) | `img/lib/clip_art/people/Doctor_Man_Black_128x128.png` |
| Médica (mulher) | `img/lib/clip_art/people/Doctor_Woman_128x128.png` |
| Médica (mulher/preta) | `img/lib/clip_art/people/Doctor_Woman_Black_128x128.png` |
| Fazendeiro (homem) | `img/lib/clip_art/people/Farmer_Man_128x128.png` |
| Fazendeiro (homem/preto) | `img/lib/clip_art/people/Farmer_Man_Black_128x128.png` |
| Fazendeira (mulher) | `img/lib/clip_art/people/Farmer_Woman_128x128.png` |
| Fazendeira (mulher/preta) | `img/lib/clip_art/people/Farmer_Woman_Black_128x128.png` |
| Enfermeiro (homem) | `img/lib/clip_art/people/Nurse_Man_128x128.png` |
| Enfermeiro (homem/preto) | `img/lib/clip_art/people/Nurse_Man_Black_128x128.png` |
| Enfermeira (mulher) | `img/lib/clip_art/people/Nurse_Woman_128x128.png` |
| Enfermeira (mulher/preta) | `img/lib/clip_art/people/Nurse_Woman_Black_128x128.png` |
| Oficial Militar (homem) | `img/lib/clip_art/people/Military_Officer_128x128.png` |
| Oficial Militar (homem/preto) | `img/lib/clip_art/people/Military_Officer_Black_128x128.png` |
| Oficial Militar (mulher) | `img/lib/clip_art/people/Military_Officer_Woman_128x128.png` |
| Oficial Militar (mulher/preta) | `img/lib/clip_art/people/Military_Officer_Woman_Black_128x128.png` |
| Piloto (homem) | `img/lib/clip_art/people/Pilot_Man_128x128.png` |
| Piloto (homem/preto) | `img/lib/clip_art/people/Pilot_Man_Black_128x128.png` |
| Piloto (mulher) | `img/lib/clip_art/people/Pilot_Woman_128x128.png` |
| Piloto (mulher/preta) | `img/lib/clip_art/people/Pilot_Woman_Black_128x128.png` |
| Cientista (homem) | `img/lib/clip_art/people/Scientist_Man_128x128.png` |
| Cientista (homem/preto) | `img/lib/clip_art/people/Scientist_Man_Black_128x128.png` |
| Cientista (mulher) | `img/lib/clip_art/people/Scientist_Woman_128x128.png` |
| Cientista (mulher/preta) | `img/lib/clip_art/people/Scientist_Woman_Black_128x128.png` |
| Segurança (homem) | `img/lib/clip_art/people/Security_Man_128x128.png` |
| Segurança (homem/preto) | `img/lib/clip_art/people/Security_Man_Black_128x128.png` |
| Segurança (mulher) | `img/lib/clip_art/people/Security_Woman_128x128.png` |
| Segurança (mulher/preta) | `img/lib/clip_art/people/Security_Woman_Black_128x128.png` |
| Técnico (homem) | `img/lib/clip_art/people/Tech_Man_128x128.png` |
| Técnico (homem/preto) | `img/lib/clip_art/people/Tech_Man_Black_128x128.png` |
| Televendas (homem) | `img/lib/clip_art/people/Telesales_Man_128x128.png` |
| Televendas (homem/preto) | `img/lib/clip_art/people/Telesales_Man_Black_128x128.png` |
| Televendas (mulher) | `img/lib/clip_art/people/Telesales_Woman_128x128.png` |
| Televendas (mulher/preta) | `img/lib/clip_art/people/Telesales_Woman_Black_128x128.png` |
| Garçom (homem) | `img/lib/clip_art/people/Waiter_128x128.png` |
| Garçom (homem/preto) | `img/lib/clip_art/people/Waiter_Black_128x128.png` |
| Garçonete (mulher) | `img/lib/clip_art/people/Waiter_Woman_128x128.png` |
| Garçonete (mulher/preta) | `img/lib/clip_art/people/Waiter_Woman_Black_128x128.png` |
| Trabalhador (preto) | `img/lib/clip_art/people/Worker_Black_128x128.png` |
| Trabalhador (homem) | `img/lib/clip_art/people/Worker_Man_128x128.png` |
| Trabalhadora (mulher) | `img/lib/clip_art/people/Worker_Woman_128x128.png` |
| Trabalhadora (mulher/preta) | `img/lib/clip_art/people/Worker_Woman_Black_128x128.png` |

### U. Cliparts - Telecomunicação
| Componente | Caminho da imagem |
|------------|-------------------|
| Palm Treo | `img/lib/clip_art/telecommunication/Palm_Treo_128x128.png` |

### V. Flowchart - Formas de Fluxograma (mxgraph.flowchart)
| Componente | Style (identificador) |
|------------|----------------------|
| Anotação 1 | `shape=mxgraph.flowchart.annotation_1` |
| Anotação 2 | `shape=mxgraph.flowchart.annotation_2` |
| Collate (Intercalar) | `shape=mxgraph.flowchart.collate` |
| Display (Exibição) | `shape=mxgraph.flowchart.display` |
| Direct Data (Dados Diretos) | `shape=mxgraph.flowchart.direct_data` |
| Delay (Atraso) | `shape=mxgraph.flowchart.delay` |
| Decision (Decisão) | `shape=mxgraph.flowchart.decision` |
| Database (Banco de Dados) | `shape=mxgraph.flowchart.database` |
| Document 2 | `shape=mxgraph.flowchart.document2` |
| Extract or Measurement | `shape=mxgraph.flowchart.extract_or_measurement` |
| Loop Limit (Limite de Loop) | `shape=mxgraph.flowchart.loop_limit` |
| Multi-Document | `shape=mxgraph.flowchart.multi-document` |
| Merge or Storage | `shape=mxgraph.flowchart.merge_or_storage` |
| Summing Function | `shape=mxgraph.flowchart.summing_function` |
| Parallel Mode (Modo Paralelo) | `shape=mxgraph.flowchart.parallel_mode` |
| Start 1 (Início 1) | `shape=mxgraph.flowchart.start_1` |
| Start 2 (Início 2) | `shape=mxgraph.flowchart.start_2` |
| Sort (Ordenar) | `shape=mxgraph.flowchart.sort` |
| Sequential Data | `shape=mxgraph.flowchart.sequential_data` |
| Stored Data (Dados Armazenados) | `shape=mxgraph.flowchart.stored_data` |
| Terminator (Terminador) | `shape=mxgraph.flowchart.terminator` |
| Or (Ou) | `shape=mxgraph.flowchart.or` |
| Manual Input | `shape=mxgraph.flowchart.manual_input` |
| Manual Operation | `shape=mxgraph.flowchart.manual_operation` |
| Preparation (Preparação) | `shape=mxgraph.flowchart.preparation` |
| On-page Reference | `shape=mxgraph.flowchart.on-page_reference` |
| Off-page Connector | `shape=mxgraph.flowchart.off-page_connector` |

### W. DFD - Data Flow Diagrams (mxgraph.dfd)
| Componente | Style (identificador) |
|------------|----------------------|
| Start (Início DFD) | `shape=mxgraph.dfd.start` |
| Archive (Arquivo) | `shape=mxgraph.dfd.archive` |
| Check 2 | `shape=mxgraph.dfd.check2` |
| Data Store ID | `shape=mxgraph.dfd.dataStoreID` |
| External Entity | `shape=mxgraph.dfd.externalEntity` |
| Loop | `shape=mxgraph.dfd.loop` |
| Read (Leitura) | `shape=mxgraph.dfd.read` |
| Write (Escrita) | `shape=mxgraph.dfd.write` |

### X. ER - Entity Relationship Diagrams
| Componente | Style (identificador) |
|------------|----------------------|
| Entidade Associativa | `shape=associativeEntity` |
| Âncora | `shape=anchor` |
| Atributo (elipse) | `ellipse` (com labelPosition para nome) |
| Chave Primária (PK) | Linha na tabela com `<u>` (sublinhado) no value |
| Chave Estrangeira (FK) | Linha na tabela com texto "FK" |
| Relacionamento Zero-para-Muitos | `edgeStyle=ERzeroToMany` (aresta) |
| Relacionamento Zero-para-Um | `edgeStyle=ERzeroToOne` (aresta) |
| Relacionamento Um | `edgeStyle=ERone` (aresta) |
| Relacionamento Um Obrigatório | `edgeStyle=ERmandOne` (aresta) |
| Relacionamento Um-para-Muitos | `edgeStyle=ERoneToMany` (aresta) |
| Relacionamento Muitos | `edgeStyle=ERmany` (aresta) |

### Y. UML - Class e Component Diagrams
| Componente | Style (identificador) |
|------------|----------------------|
| Frame (Quadro UML) | `shape=umlFrame` |
| Nota 2 | `shape=note2` |
| Instância | `html=1` com label `:ClassName` |
| Classifier (Classificador) | `swimlane;fontStyle=1;align=center` |
| Componente/Módulo | `shape=module` |
| Pacote (Package) | `shape=folder` |
| Required Interface | `shape=requires` |
| Provided Interface | `shape=providedRequiredInterface` |
| Port | `shape=umlPort` ou `shape=component;jettyWidth=8;jettyHeight=4` |

### Z. UML - State Machine Diagrams
| Componente | Style (identificador) |
|------------|----------------------|
| Estado (State) | `shape=umlState` ou `swimlane;fontStyle=1` |
| Estado Inicial | `ellipse;fillColor=#000000` (círculo preto sólido) |
| Estado Final | `ellipse;shape=endState` ou `shape=endState` |
| Estado Composto | `swimlane;fontStyle=1` com região interna |
| Fork/Join (Barra) | `fillColor=#000000` (retângulo estreito preto) |
| Ponto de Escolha | `rhombus` |
| História (Shallow) | `ellipse` com label "H" |
| História Profunda (Deep) | `ellipse` com label "H*" |
| Ponto de Entrada | `ellipse;fillColor=#000000` (pequeno círculo preto) |
| Ponto de Saída | `ellipse` com X interno |

### AA. UML - Activity Diagrams
| Componente | Style (identificador) |
|------------|----------------------|
| Ação (Action) | `shape=mxgraph.uml25.action` |
| Ação com Parâmetros | `shape=mxgraph.uml25.actionParams` |
| Behavior Action | `shape=mxgraph.uml25.behaviorAction` |
| Trigger (Gatilho) | `shape=mxgraph.infographic.ribbonSimple` |
| Input Pin | `shape=mxgraph.uml25.inputPin` |
| Output Pin | `shape=mxgraph.uml25.outputPin` |
| Partição/Swimlane | `swimlane;horizontal=0` |
| Nó de Decisão | `rhombus` |
| Nó de Merge | `rhombus` (mesmo que decisão) |
| Fork/Join | `fillColor=#000000` (barra preta) |
| Região de Expansão | `swimlane;startSize=20` |
| Activity Final | `ellipse;shape=endState` |
| Flow Final | `ellipse` com X interno |
| Signal Send | `mxgraph.uml25.sendSignal` |
| Signal Receive | `mxgraph.uml25.receiveSignal` |
| Central Buffer | `shape=mxgraph.uml25.centralBuffer` |
| Data Store | `shape=mxgraph.uml25.dataStore` |
| Call Behavior Action | `shape=mxgraph.uml25.callBehavior` |

### AB. UML - Sequence/Interaction Diagrams
| Componente | Style (identificador) |
|------------|----------------------|
| Lifeline (Linha de Vida) | `shape=umlLifeline` |
| Destroy (Destruição) | `shape=umlDestroy` |
| Activation (Ativação) | Retângulo estreito sobre lifeline |
| Ref Frame (Frame de Referência) | `shape=umlFrame;whiteSpace=wrap` com "ref" |
| Continuation | Retângulo arredondado sobre lifeline |
| State Invariant | Retângulo com `rounded=1` sobre lifeline |
| Mensagem Síncrona | Aresta com `endArrow=block;endFill=1` |
| Mensagem Assíncrona | Aresta com `endArrow=open` |
| Mensagem de Retorno | Aresta com `dashed=1` |
| Mensagem de Criação | Aresta apontando para cabeça de lifeline |
| Self-Message | Aresta com loops (curved) |
| Combined Fragment (alt/opt/loop) | `shape=umlFrame` com operador |

### AC. UML - Use Case Diagrams
| Componente | Style (identificador) |
|------------|----------------------|
| Ator | `shape=umlActor` |
| Caso de Uso | `ellipse` com nome centralizado |
| Caso de Uso com Extension Points | `swimlane;fontStyle=1;startSize=25` (tabela) |
| System Boundary | Retângulo com nome do sistema no topo |
| Associação | Aresta simples sem setas |
| Include | Aresta tracejada com `<<include>>` |
| Extend | Aresta tracejada com `<<extend>>` |
| Generalização | Aresta com `endArrow=block;endFill=0` |

### AD. UML - Deployment Diagrams
| Componente | Style (identificador) |
|------------|----------------------|
| Deployment Target/Nó | `shape=cube;size=10` |
| Artefato | `shape=component` ou retângulo com ícone |
| Device | `shape=cube` com `<<device>>` |
| Execution Environment | `shape=cube` com `<<executionEnvironment>>` |
| Communication Path | Aresta simples |
| Dependency | Aresta tracejada com seta aberta |
| Deploy (relacionamento) | Aresta tracejada com `<<deploy>>` |

### AE. Infographic Shapes (mxgraph.infographic)
| Componente | Style (identificador) |
|------------|----------------------|
| Ribbon Simple | `shape=mxgraph.infographic.ribbonSimple` |
| Banner | `shape=mxgraph.infographic.banner` |
| Banner Folded | `shape=mxgraph.infographic.bannerFolded` |
| Circular Callout | `shape=mxgraph.infographic.circularCallout` |
| Ribbon Rolled | `shape=mxgraph.infographic.ribbonRolled` |
| Arrow Ribbon | `shape=mxgraph.infographic.arrowRibbon` |
| Shadowed Box | `shape=mxgraph.infographic.shadedBox` |

### AF. Tables and Matrices (Tabelas)
| Componente | Style (identificador) |
|------------|----------------------|
| Tabela (container) | `swimlane;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0` |
| Linha de Tabela | `swimlane;startSize=0;horizontal=1` |
| Célula | `shape=partialRectangle;overflow=hidden` |
| Tabela HTML | `html=1` com `<table>` no value |
| Divisor de Coluna | Aresta interna vertical |
| Cabeçalho | Célula com `fontStyle=1` (bold) |

### AG. Basic Shapes Adicionais
| Componente | Style (identificador) |
|------------|----------------------|
| Callout Quadrado | `shape=callout` |
| Callout Arredondado | `shape=callout;rounded=1` |
| Cross (Cruz) | `shape=cross` |
| Link/Elo | `shape=link` |
| Tape/Fita | `shape=tape` |
| Documento | `shape=document` |
| Card | `shape=card` |
| Internal Storage | `shape=internalStorage` |
| Corner | `shape=corner` |
| Tee | `shape=tee` |
| Single Arrow | `shape=singleArrow` |
| Double Arrow | `shape=doubleArrow` |

### AH. UML - Classes e Objetos Detalhados
| Componente | Style (identificador) |
|------------|----------------------|
| Objeto simples | `html=1;whiteSpace=wrap` |
| Interface (estereótipo) | `html=1` com `«interface»` no value |
| Classe (swimlane) | `swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout` |
| Campo de classe | `text;strokeColor=none;fillColor=none;align=left` |
| Linha divisória | `line;strokeWidth=1;fillColor=none` |
| Classe simples (fields only) | `swimlane;fontStyle=0;childLayout=stackLayout` |
| Item/Atributo | `text;strokeColor=none;fillColor=none;align=left` |
| Componente com Annotation | `html=1;dropTarget=0` com `«Annotation»` |
| Ícone Module | `shape=module;jettyWidth=8;jettyHeight=4` |
| Título (bold) | `text;align=center;fontStyle=1` |
| Componente com atributos | `align=left;overflow=fill;html=1;dropTarget=0` |
| Ícone Component | `shape=component;jettyWidth=8;jettyHeight=4` |
| Módulo | `shape=module;align=left;spacingLeft=20` |
| Bloco (3D) | `shape=cube;size=10;direction=south;fontStyle=4` |
| Pacote | `shape=folder;fontStyle=1;spacingTop=10;tabWidth=40;tabHeight=14` |
| Objeto (instance) | Com `<u>Object:Type</u>` sublinhado no value |
| Interface completa | Com `«Interface»` + fields + methods no HTML |
| Classe com 3 seções | Com `<hr>` separando nome, fields, methods |
| Classe vazia (2 seções) | Com duas `<hr>` e altura mínima |
| Tabela DB (HTML) | Com `<div>` header + `<table>` para PK/FK/fields |

### AI. UML - Interfaces e Conectores
| Componente | Style (identificador) |
|------------|----------------------|
| Provided+Required Interface | `shape=providedRequiredInterface` |
| Required Interface | `shape=requiredInterface` |
| Conector half-circle | `endArrow=halfCircle;endFill=0;endSize=6;curved=1` |
| Conector oval | `endArrow=oval;endFill=0;endSize=10` |
| Ponto invisível (perimeter) | `ellipse;fillColor=none;strokeColor=none;perimeter=centerPerimeter` |

### AJ. UML - Robustness/Boundary Objects
| Componente | Style (identificador) |
|------------|----------------------|
| Boundary Object | `shape=umlBoundary` |
| Control Object | `ellipse;shape=umlControl` |
| Entity Object | `ellipse;shape=umlEntity` |

### AK. UML - Activity/State (Detalhado)
| Componente | Style (identificador) |
|------------|----------------------|
| Estado Inicial (círculo preto) | `ellipse;shape=startState;fillColor=#000000` |
| Activity (arredondado) | `rounded=1;arcSize=40;fillColor=#ffffc0` |
| Estado Composto (swimlane) | `swimlane;fontStyle=1;align=center;childLayout=stackLayout;rounded=1;arcSize=30` |
| Subtítulo do estado | `text;html=1;strokeColor=none;fillColor=none;align=center` |
| Condição (losango) | `rhombus;fillColor=#ffffc0` |
| Barra de sincronização | `shape=line;strokeWidth=6` |
| Estado Final | `ellipse;shape=endState;fillColor=#000000` |
| Transição (aresta) | `edgeStyle=orthogonalEdgeStyle;endArrow=open;endSize=8` |
| Transição com label | Aresta com `value="yes"` ou `value="no"` |

### AL. UML - Lifelines Especializados
| Componente | Style (identificador) |
|------------|----------------------|
| Lifeline Control | `shape=umlLifeline;participant=umlControl` |
| Lifeline Entity | `shape=umlLifeline;participant=umlEntity` |
| Lifeline Boundary | `shape=umlLifeline;participant=umlBoundary` |
| Lifeline Actor | `shape=umlLifeline;participant=umlActor` |
| Lifeline Object | `shape=umlLifeline` |
| Frame UML | `shape=umlFrame;pointerEvents=0` |
| Destroy marker | `shape=umlDestroy;strokeWidth=3` |
| Activation bar | `html=1;points=[[0,0,0,0,5],[0,1,0,0,-5],[1,0,0,0,5],[1,1,0,0,-5]];perimeter=orthogonalPerimeter` |

### AM. UML - Mensagens de Sequência
| Componente | Style (identificador) |
|------------|----------------------|
| Dispatch com found | `startArrow=oval;endArrow=block;startSize=8` |
| Dispatch simples | `endArrow=block` |
| Return (tracejado) | `endArrow=open;dashed=1;endSize=8` |
| Self-call | `edgeStyle=orthogonalEdgeStyle` com loop |
| Async message | `startArrow=circle;startFill=1;endArrow=open` |
| Found message | `startArrow=oval;startFill=1;endArrow=block` |
| Callback | `endArrow=block` (direção oposta) |

### AN. UML - Relacionamentos de Classe
| Componente | Style (identificador) |
|------------|----------------------|
| Association simples | `endArrow=none` |
| Association com labels | Com `edgeLabel` parent/child |
| Aggregation (diamante vazio) | `startArrow=diamondThin;startFill=0;endArrow=open;startSize=14` |
| Composition (diamante cheio) | `startArrow=diamondThin;startFill=1;endArrow=open;startSize=14` |
| Inner class | `startArrow=circlePlus;endArrow=open;startFill=0` |
| Bidirectional | `startArrow=block;endArrow=block;startFill=1;endFill=1` |
| Extends/Generalization | `endArrow=block;endSize=16;endFill=0` |
| Use/Dependency | `endArrow=open;endSize=12;dashed=1` |
| Relation com multiplicidade | Com `edgeLabel` 0..n, 1, etc. |
| Aggregation vazia | `endArrow=diamondThin;endFill=0;endSize=24` |
| Realization | `endArrow=block;dashed=1;endFill=0;endSize=12` |
| Delete/Cross | `startArrow=cross;endArrow=open;startFill=0;startSize=10` |
| Composition cheio | `endArrow=diamondThin;endFill=1;endSize=24` |
| Association direcionada | `endArrow=open;endFill=1;endSize=12` |

### AO. C4 Model - Diagramas de Arquitetura
| Componente | Style (identificador) |
|------------|----------------------|
| Person (C4) | `shape=mxgraph.c4.person2;fillColor=#083F75` |
| External Person (C4) | `shape=mxgraph.c4.person2;fillColor=#6C6477` |
| Software System | `rounded=1;fillColor=#1061B0;arcSize=10` |
| External System | `rounded=1;fillColor=#8C8496;arcSize=10` |
| Container | `rounded=1;fillColor=#23A2D9;arcSize=10` |
| Component | `rounded=1;fillColor=#63BEF2;arcSize=6` |
| Web Browser Container | `shape=mxgraph.c4.webBrowserContainer2;fillColor=#23A2D9` |
| Message Bus Container | `shape=cylinder3;direction=south;fillColor=#23A2D9` |
| Microservice Container | `shape=hexagon;size=50;fillColor=#23A2D9` |
| Database Container | `shape=cylinder3;fillColor=#23A2D9` |
| C4 Relationship | `endArrow=blockThin;endFill=1;strokeColor=#828282;edgeStyle=orthogonalEdgeStyle` |
| System Scope Boundary | `rounded=1;dashed=1;arcSize=20;fillColor=none;dashPattern=8 4` |
| Container Scope Boundary | `rounded=1;dashed=1;arcSize=20;fillColor=none` |
| C4 Legend Table | `shape=table;startSize=30;childLayout=tableLayout` |
| Legend Row | `shape=tableRow;horizontal=0` |
| Legend Cell | `shape=partialRectangle;overflow=hidden` |
| Diagram Title (C4) | `text;html=1;metaEdit=1` com c4Name, c4Type, c4Description |

### AP. Network Shapes - Topologia (mxgraph.networks)
| Componente | Style (identificador) |
|------------|----------------------|
| Bus (backbone) | `shape=mxgraph.networks.bus;perimeter=backbonePerimeter;backboneSize=20` |
| Hub circular | `shape=ellipse` com arestas radiais |
| Comm Link Edge | `shape=mxgraph.networks.comm_link_edge` |
| Biometric Reader | `shape=mxgraph.networks.biometric_reader` |
| Copier | `shape=mxgraph.networks.copier` |
| Comm Link | `shape=mxgraph.networks.comm_link` |
| Community | `shape=mxgraph.networks.community` |
| Cloud (network) | `shape=mxgraph.networks.cloud` |
| Business Center | `shape=mxgraph.networks.business_center` |
| PC | `shape=mxgraph.networks.pc` |
| Desktop PC | `shape=mxgraph.networks.desktop_pc` |
| External Storage | `shape=mxgraph.networks.external_storage` |
| Firewall | `shape=mxgraph.networks.firewall` |
| Gamepad | `shape=mxgraph.networks.gamepad` |
| Mainframe | `shape=mxgraph.networks.mainframe` |
| Mail Server | `shape=mxgraph.networks.mail_server` |
| Load Balancer | `shape=mxgraph.networks.load_balancer` |
| Laptop | `shape=mxgraph.networks.laptop` |
| Hub | `shape=mxgraph.networks.hub` |
| Mobile | `shape=mxgraph.networks.mobile` |
| Modem | `shape=mxgraph.networks.modem` |
| Monitor | `shape=mxgraph.networks.monitor` |
| NAS Filer | `shape=mxgraph.networks.nas_filer` |
| Patch Panel | `shape=mxgraph.networks.patch_panel` |
| Proxy Server | `shape=mxgraph.networks.proxy_server` |
| Printer | `shape=mxgraph.networks.printer` |
| Phone 1 | `shape=mxgraph.networks.phone_1` |
| Phone 2 | `shape=mxgraph.networks.phone_2` |
| Rack | `shape=mxgraph.networks.rack` |
| Radio Tower | `shape=mxgraph.networks.radio_tower` |
| Router | `shape=mxgraph.networks.router` |
| Satellite | `shape=mxgraph.networks.satellite` |
| Satellite Dish | `shape=mxgraph.networks.satellite_dish` |
| Server Storage | `shape=mxgraph.networks.server_storage` |
| Server | `shape=mxgraph.networks.server` |
| Security Camera | `shape=mxgraph.networks.security_camera` |
| Secured | `shape=mxgraph.networks.secured` |
| Scanner | `shape=mxgraph.networks.scanner` |
| Storage | `shape=mxgraph.networks.storage` |
| Supercomputer | `shape=mxgraph.networks.supercomputer` |
| Switch | `shape=mxgraph.networks.switch` |
| Tablet | `shape=mxgraph.networks.tablet` |
| Tape Storage | `shape=mxgraph.networks.tape_storage` |
| USB Stick | `shape=mxgraph.networks.usb_stick` |
| UPS Small | `shape=mxgraph.networks.ups_small` |
| UPS Enterprise | `shape=mxgraph.networks.ups_enterprise` |
| Unsecure | `shape=mxgraph.networks.unsecure` |
| Terminal | `shape=mxgraph.networks.terminal` |
| Users | `shape=mxgraph.networks.users` |
| User Female | `shape=mxgraph.networks.user_female` |
| User Male | `shape=mxgraph.networks.user_male` |
| Video Projector | `shape=mxgraph.networks.video_projector` |
| Video Projector Screen | `shape=mxgraph.networks.video_projector_screen` |
| Wireless Hub | `shape=mxgraph.networks.wireless_hub` |
| Web Server | `shape=mxgraph.networks.web_server` |
| Virus | `shape=mxgraph.networks.virus` |
| Virtual Server | `shape=mxgraph.networks.virtual_server` |
| Virtual PC | `shape=mxgraph.networks.virtual_pc` |
| Wireless Modem | `shape=mxgraph.networks.wireless_modem` |

### AQ. Microsoft Office - Clouds (mxgraph.office.clouds)
| Componente | Style (identificador) |
|------------|----------------------|
| Azure Cloud | `shape=mxgraph.office.clouds.azure` |
| Cloud | `shape=mxgraph.office.clouds.cloud` |
| Cloud Disaster | `shape=mxgraph.office.clouds.cloud_disaster` |
| Cloud Exchange Online | `shape=mxgraph.office.clouds.cloud_exchange_online` |
| Online User | `shape=mxgraph.office.clouds.online_user` |
| Online Backup | `shape=mxgraph.office.clouds.online_backup` |
| Office 365 | `shape=mxgraph.office.clouds.office_365` |
| Cloud SharePoint | `shape=mxgraph.office.clouds.cloud_sharepoint` |
| Cloud Service Request | `shape=mxgraph.office.clouds.cloud_service_request` |
| Private Cloud | `shape=mxgraph.office.clouds.private_cloud` |
| Public Cloud | `shape=mxgraph.office.clouds.public_cloud` |
| Public IM Cloud Service | `shape=mxgraph.office.clouds.public_im_cloud_service` |

### AR. Microsoft Office - Communications (mxgraph.office.communications)
| Componente | Style (identificador) |
|------------|----------------------|
| 3rd Party Call Center | `shape=mxgraph.office.communications.3rd_party_call_center_solution` |
| 3rd Party Integration | `shape=mxgraph.office.communications.3rd_party_integration` |
| 3rd Party Service | `shape=mxgraph.office.communications.3rd_party_service` |
| Application Sharing Workload | `shape=mxgraph.office.communications.application_sharing_workload` |
| Audio Conferencing | `shape=mxgraph.office.communications.audio_conferencing_application` |
| Discovery Search Mailbox | `shape=mxgraph.office.communications.discovery_search_mailbox` |
| Disconnected Mailbox | `shape=mxgraph.office.communications.disconnected_mailbox` |
| Conference Announcement | `shape=mxgraph.office.communications.conference_announcement_service` |
| Chat Room | `shape=mxgraph.office.communications.chat_room` |
| Central Management Service | `shape=mxgraph.office.communications.central_management_service` |
| Dynamic Distribution Group | `shape=mxgraph.office.communications.dynamic_distribution_group` |
| Edge Subscription | `shape=mxgraph.office.communications.edge_subscription` |
| Email Workload | `shape=mxgraph.office.communications.email_workloaad` |
| Equipment Mailbox | `shape=mxgraph.office.communications.equipment_mailbox` |
| Exchange Active Sync | `shape=mxgraph.office.communications.exchange_active_sync` |
| IM Workload | `shape=mxgraph.office.communications.im_workload` |
| Hybrid VoIP Gateway | `shape=mxgraph.office.communications.hybrid_voip_gateway` |
| Global Address List | `shape=mxgraph.office.communications.global_address_list` |
| Fax Partner | `shape=mxgraph.office.communications.fax_partner` |
| Journaling Rule | `shape=mxgraph.office.communications.journaling_rule` |
| Lync Phone Edition | `shape=mxgraph.office.communications.lync_phone_edition` |
| Lync Room System | `shape=mxgraph.office.communications.lync_room_system` |
| Mailbox Assistant | `shape=mxgraph.office.communications.mailbox_assistant` |
| Mail Enabled Public Folder | `shape=mxgraph.office.communications.mail_enabled_public_folder` |
| Lync Web App Client | `shape=mxgraph.office.communications.lync_web_app_client` |
| Lync Storage Service | `shape=mxgraph.office.communications.lync_storage_service` |
| Lync Server Management Tool | `shape=mxgraph.office.communications.lync_server_management_tool` |
| Messages Queued | `shape=mxgraph.office.communications.messages_queued` |
| Offline Address Book | `shape=mxgraph.office.communications.offline_address_book` |
| Personal Archive Mailbox | `shape=mxgraph.office.communications.personal_archive_mailbox` |
| Public IM Cloud Service | `shape=mxgraph.office.communications.public_im_cloud_service` |
| Push Notification Service | `shape=mxgraph.office.communications.push_notification_service` |
| Room Mailbox | `shape=mxgraph.office.communications.room_mailbox` |
| Response Group | `shape=mxgraph.office.communications.response_group` |
| Remote Move Request | `shape=mxgraph.office.communications.remote_move_request` |
| Remote Mailbox | `shape=mxgraph.office.communications.remote_mailbox` |
| Queue Viewer | `shape=mxgraph.office.communications.queue_viewer` |
| Skype for Business Phone Edition | `shape=mxgraph.office.communications.skype_for_business_phone_edition` |
| Skype for Business Control Panel | `shape=mxgraph.office.communications.skype_for_business_control_panel` |
| Site Mailbox | `shape=mxgraph.office.communications.site_mailbox` |
| SIP URI UM Dial Plan | `shape=mxgraph.office.communications.sip_uri_um_dial_plan` |
| Shared Mailbox | `shape=mxgraph.office.communications.shared_mailbox` |
| Skype for Business Room System | `shape=mxgraph.office.communications.skype_for_business_room_system` |
| Skype for Business Server Management | `shape=mxgraph.office.communications.skype_for_business_server_management_tool` |
| Skype for Business Storage Service | `shape=mxgraph.office.communications.skype_for_business_storage_service` |
| Skype for Business Web App Client | `shape=mxgraph.office.communications.skype_for_business_web_app_client` |
| SMS Gateway | `shape=mxgraph.office.communications.sms_gateway` |
| Transport Rule | `shape=mxgraph.office.communications.transport_rule` |
| Telephone Extension Dial Plan | `shape=mxgraph.office.communications.telephone_extension_dial_plan` |
| TDM PBX | `shape=mxgraph.office.communications.tdm_pbx` |
| System Mailbox | `shape=mxgraph.office.communications.system_mailbox` |
| SMTP Connector | `shape=mxgraph.office.communications.smtp_connector` |
| UCMA Application | `shape=mxgraph.office.communications.ucma_application` |
| UCWA Application | `shape=mxgraph.office.communications.ucwa_application` |
| UM Auto Attendant | `shape=mxgraph.office.communications.um_auto_attendant` |
| UM Dial Plan E164 | `shape=mxgraph.office.communications.um_dial_plan_e164` |
| UM Dial Plan Secondary | `shape=mxgraph.office.communications.um_dial_plan_secondary` |
| Video Workload | `shape=mxgraph.office.communications.video_workload` |
| User Mailbox | `shape=mxgraph.office.communications.user_mailbox` |
| UM IP Gateway | `shape=mxgraph.office.communications.um_ip_gateway` |
| UM Hunt Group | `shape=mxgraph.office.communications.um_hunt_group` |
| UM Enabled Mailbox | `shape=mxgraph.office.communications.um_enabled_mailbox` |
| Voice Mail Preview | `shape=mxgraph.office.communications.voice_mail_preview` |
| Voice Workload | `shape=mxgraph.office.communications.voice_workload` |

### AS. Microsoft Office - Concepts (mxgraph.office.concepts)
| Componente | Style (identificador) |
|------------|----------------------|
| Address Book | `shape=mxgraph.office.concepts.address_book` |
| Anti Spam | `shape=mxgraph.office.concepts.anti_spam` |
| Application Android | `shape=mxgraph.office.concepts.application_android` |
| Application Generic | `shape=mxgraph.office.concepts.application_generic` |
| Application Windows | `shape=mxgraph.office.concepts.application_windows` |
| Application Web | `shape=mxgraph.office.concepts.application_web` |
| Application iOS | `shape=mxgraph.office.concepts.application_ios` |
| Application Hybrid | `shape=mxgraph.office.concepts.application_hybrid` |
| App for Office | `shape=mxgraph.office.concepts.app_for_office` |
| App for SharePoint | `shape=mxgraph.office.concepts.app_for_sharepoint` |
| App Part | `shape=mxgraph.office.concepts.app_part` |
| Archive | `shape=mxgraph.office.concepts.archive` |
| Attachment | `shape=mxgraph.office.concepts.attachment` |
| Best Practices | `shape=mxgraph.office.concepts.best_practices` |
| Bandwidth Calculator | `shape=mxgraph.office.concepts.bandwidth_calculator` |
| Bandwidth | `shape=mxgraph.office.concepts.bandwidth` |
| Backup Online | `shape=mxgraph.office.concepts.backup_online` |
| Backup Local | `shape=mxgraph.office.concepts.backup_local` |
| Book Journal | `shape=mxgraph.office.concepts.book_journal` |
| Calculator | `shape=mxgraph.office.concepts.calculator` |
| Calendar | `shape=mxgraph.office.concepts.calendar` |
| Clipboard | `shape=mxgraph.office.concepts.clipboard` |
| Connector | `shape=mxgraph.office.concepts.connector` |
| Column | `shape=mxgraph.office.concepts.column` |
| Clock | `shape=mxgraph.office.concepts.clock` |
| Contacts | `shape=mxgraph.office.concepts.contacts` |
| Content Type | `shape=mxgraph.office.concepts.content_type` |
| Credit Card | `shape=mxgraph.office.concepts.credit_card` |
| Document | `shape=mxgraph.office.concepts.document` |
| Document Shared | `shape=mxgraph.office.concepts.document_shared` |
| Document Blank | `shape=mxgraph.office.concepts.document_blank` |
| Documents Shared | `shape=mxgraph.office.concepts.documents_shared` |
| Documents | `shape=mxgraph.office.concepts.documents` |
| Download | `shape=mxgraph.office.concepts.download` |
| Email | `shape=mxgraph.office.concepts.email` |
| Email Approved | `shape=mxgraph.office.concepts.email_approved` |
| Email Expired | `shape=mxgraph.office.concepts.email_expired` |
| Email Rejected | `shape=mxgraph.office.concepts.email_rejected` |
| Firewall | `shape=mxgraph.office.concepts.firewall` |
| File Key | `shape=mxgraph.office.concepts.file_key` |
| Folder | `shape=mxgraph.office.concepts.folder` |
| Folder Open | `shape=mxgraph.office.concepts.folder_open` |
| Folders | `shape=mxgraph.office.concepts.folders` |
| Folder Public | `shape=mxgraph.office.concepts.folder_public` |
| Folder Shared | `shape=mxgraph.office.concepts.folder_shared` |
| Form | `shape=mxgraph.office.concepts.form` |
| Get Started | `shape=mxgraph.office.concepts.get_started` |
| Globe Internet | `shape=mxgraph.office.concepts.globe_internet` |
| Home | `shape=mxgraph.office.concepts.home` |
| Help | `shape=mxgraph.office.concepts.help` |
| Home Page | `shape=mxgraph.office.concepts.home_page` |
| Input Output Filter | `shape=mxgraph.office.concepts.input_output_filter` |
| Hybrid | `shape=mxgraph.office.concepts.hybrid` |
| License | `shape=mxgraph.office.concepts.license` |
| Learn | `shape=mxgraph.office.concepts.learn` |
| Lab | `shape=mxgraph.office.concepts.lab` |
| Integration | `shape=mxgraph.office.concepts.integration` |
| Install | `shape=mxgraph.office.concepts.install` |
| Link | `shape=mxgraph.office.concepts.link` |
| List Library | `shape=mxgraph.office.concepts.list_library` |
| Mailbox | `shape=mxgraph.office.concepts.mailbox` |
| Mailbox 2 | `shape=mxgraph.office.concepts.mailbox2` |
| Migration | `shape=mxgraph.office.concepts.migration` |
| Meets Requirements | `shape=mxgraph.office.concepts.meets_requirements` |
| Marketplace Shopping Bag | `shape=mxgraph.office.concepts.marketplace_shopping_bag` |
| Maintenance | `shape=mxgraph.office.concepts.maintenance` |
| MOEs | `shape=mxgraph.office.concepts.moes` |
| Navigation | `shape=mxgraph.office.concepts.navigation` |
| Node Generic | `shape=mxgraph.office.concepts.node_generic` |
| On Premises Directory | `shape=mxgraph.office.concepts.on_premises_directory` |
| On Premises | `shape=mxgraph.office.concepts.on_premises` |
| Office Installed | `shape=mxgraph.office.concepts.office_installed` |
| Phishing | `shape=mxgraph.office.concepts.phishing` |
| Pin | `shape=mxgraph.office.concepts.pin` |
| Platform Options | `shape=mxgraph.office.concepts.platform_options` |
| PowerShell | `shape=mxgraph.office.concepts.powershell` |
| Properties | `shape=mxgraph.office.concepts.properties` |
| Search | `shape=mxgraph.office.concepts.search` |
| Script | `shape=mxgraph.office.concepts.script` |
| Remote Access | `shape=mxgraph.office.concepts.remote_access` |
| Publish | `shape=mxgraph.office.concepts.publish` |
| Service Application | `shape=mxgraph.office.concepts.service_application` |
| Settings | `shape=mxgraph.office.concepts.settings` |
| Settings Office 365 | `shape=mxgraph.office.concepts.settings_office_365` |
| Sign Up | `shape=mxgraph.office.concepts.sign_up` |
| Upgrade Server | `shape=mxgraph.office.concepts.upgrade_server` |
| Upgrade Application | `shape=mxgraph.office.concepts.upgrade_application` |
| Technical Diagram | `shape=mxgraph.office.concepts.technical_diagram` |
| Tasks | `shape=mxgraph.office.concepts.tasks` |
| Sound File | `shape=mxgraph.office.concepts.sound_file` |
| Upgrade Site | `shape=mxgraph.office.concepts.upgrade_site` |
| Upload | `shape=mxgraph.office.concepts.upload` |
| Video Form | `shape=mxgraph.office.concepts.video_form` |
| Video Play | `shape=mxgraph.office.concepts.video_play` |
| Voicemail | `shape=mxgraph.office.concepts.voicemail` |
| Web Page | `shape=mxgraph.office.concepts.web_page` |
| Web Conferencing | `shape=mxgraph.office.concepts.web_conferencing` |
| Website | `shape=mxgraph.office.concepts.website` |
| Walkthrough | `shape=mxgraph.office.concepts.walkthrough` |
| Voicemail Preview | `shape=mxgraph.office.concepts.voicemail_preview` |
| Writing Pencil | `shape=mxgraph.office.concepts.writing_pencil` |
| Writing Pen | `shape=mxgraph.office.concepts.writing_pen` |
| What's New | `shape=mxgraph.office.concepts.whats_new` |

#### Variações de Cores (fillColor)
Os ícones do Office Concepts suportam variações de cores através do atributo `fillColor`:
| Cor | fillColor |
|-----|-----------|
| Cinza (padrão) | `fillColor=#505050` |
| Azul | `fillColor=#2072B8` |
| Vermelho | `fillColor=#DA4026` |
| Verde | `fillColor=#7FBA42` |
| Cinza Claro | `fillColor=#CCCBCB` |

### AT. Microsoft Office - Databases (mxgraph.office.databases)
| Componente | Style (identificador) |
|------------|----------------------|
| Address Book Store | `shape=mxgraph.office.databases.address_book_store` |
| Application Store | `shape=mxgraph.office.databases.application_store` |
| Database | `shape=mxgraph.office.databases.database` |
| Database Availability Group | `shape=mxgraph.office.databases.database_availability_group` |
| Database Cube | `shape=mxgraph.office.databases.database_cube` |
| Database Mini 1 | `shape=mxgraph.office.databases.database_mini_1` |
| Database Mini 2 | `shape=mxgraph.office.databases.database_mini_2` |
| Database Mini 3 | `shape=mxgraph.office.databases.database_mini_3` |
| Database Mirror | `shape=mxgraph.office.databases.database_mirror` |
| Database Mirror Witness Node | `shape=mxgraph.office.databases.database_mirror_witness_node` |
| Database Partition 2 | `shape=mxgraph.office.databases.database_partition_2` |
| Database Partition 3 | `shape=mxgraph.office.databases.database_partition_3` |
| Database Partition 4 | `shape=mxgraph.office.databases.database_partition_4` |
| Database Partition 5 | `shape=mxgraph.office.databases.database_partition_5` |
| Database Public Folder | `shape=mxgraph.office.databases.database_public_folder` |
| Database Server | `shape=mxgraph.office.databases.database_server` |
| Database Server (Blue) | `shape=mxgraph.office.databases.database_server_blue` |
| Database Server (Green) | `shape=mxgraph.office.databases.database_server_green` |
| Database Server (Orange) | `shape=mxgraph.office.databases.database_server_orange` |
| Database Server (Ghosted) | `shape=mxgraph.office.databases.database_server_ghosted` |
| Mailbox Database | `shape=mxgraph.office.databases.mailbox_database` |
| Monitoring Store | `shape=mxgraph.office.databases.monitoring_store` |
| Unified Contact Store | `shape=mxgraph.office.databases.unified_contact_store` |
| Web Store | `shape=mxgraph.office.databases.web_store` |

#### Variações de Cores (fillColor)
Os ícones do Office Databases suportam variações de cores através do atributo `fillColor`:
| Cor | fillColor |
|-----|-----------|
| Cinza (padrão) | `fillColor=#505050` |
| Azul | `fillColor=#2072B8` |
| Vermelho | `fillColor=#DA4026` |
| Verde | `fillColor=#7FBA42` |
| Cinza Claro | `fillColor=#CCCBCB` |

### AU. Microsoft Office - Devices (mxgraph.office.devices)
| Componente | Style (identificador) |
|------------|----------------------|
| Bluetooth | `shape=mxgraph.office.devices.bluetooth` |
| CD/DVD | `shape=mxgraph.office.devices.cd_dvd` |
| Cell Phone - Android (Proportional) | `shape=mxgraph.office.devices.cell_phone_android_proportional` |
| Cell Phone - Android (Standalone) | `shape=mxgraph.office.devices.cell_phone_android_standalone` |
| Cell Phone - Generic | `shape=mxgraph.office.devices.cell_phone_generic` |
| Cell Phone - iPhone (Proportional) | `shape=mxgraph.office.devices.cell_phone_iphone_proportional` |
| Cell Phone - iPhone (Standalone) | `shape=mxgraph.office.devices.cell_phone_iphone_standalone` |
| Cell Phone - Windows Phone (Proportional) | `shape=mxgraph.office.devices.cell_phone_windows_phone_proportional` |
| Cell Phone - Windows Phone (Standalone) | `shape=mxgraph.office.devices.cell_phone_windows_phone_standalone` |
| Data Jack | `shape=mxgraph.office.devices.data_jack` |
| Device Dual | `shape=mxgraph.office.devices.device_dual` |
| Device LCD/Monitor | `shape=mxgraph.office.devices.device_lcd_monitor` |
| Device Laptop | `shape=mxgraph.office.devices.device_laptop` |
| Device Mac Client | `shape=mxgraph.office.devices.device_mac_client` |
| Device Stylus | `shape=mxgraph.office.devices.device_stylus` |
| Device Tablet - Android | `shape=mxgraph.office.devices.device_tablet_android` |
| Device Tablet - iPad (Landscape) | `shape=mxgraph.office.devices.device_tablet_ipad_landscape` |
| Device Tablet - iPad (Mini) | `shape=mxgraph.office.devices.device_tablet_ipad_mini` |
| Device Tablet - iPad Portrait | `shape=mxgraph.office.devices.device_tablet_ipad_portrait` |
| Device Tablet - Windows | `shape=mxgraph.office.devices.device_tablet_windows` |
| Device TV | `shape=mxgraph.office.devices.device_tv` |
| Device Update Service | `shape=mxgraph.office.devices.device_update_service` |
| Device Webcam | `shape=mxgraph.office.devices.device_webcam` |
| Device Webcam HD | `shape=mxgraph.office.devices.device_webcam_hd` |
| Device Workstation | `shape=mxgraph.office.devices.device_workstation` |
| Device Workstation (PC) | `shape=mxgraph.office.devices.device_workstation_pc` |
| Fax | `shape=mxgraph.office.devices.fax` |
| Hard Disk | `shape=mxgraph.office.devices.hard_disk` |
| Headset | `shape=mxgraph.office.devices.headset` |
| IP Gateway | `shape=mxgraph.office.devices.ip_gateway` |
| IP PBX | `shape=mxgraph.office.devices.ip_pbx` |
| Load Balancer | `shape=mxgraph.office.devices.load_balancer` |
| Management Console | `shape=mxgraph.office.devices.management_console` |
| Microphone | `shape=mxgraph.office.devices.microphone` |
| Modem | `shape=mxgraph.office.devices.modem` |
| NIC | `shape=mxgraph.office.devices.nic` |
| Phone Digital | `shape=mxgraph.office.devices.phone_digital` |
| Phone Traditional | `shape=mxgraph.office.devices.phone_traditional` |
| Phone USB | `shape=mxgraph.office.devices.phone_usb` |
| Phone VoIP | `shape=mxgraph.office.devices.phone_voip` |
| Printer | `shape=mxgraph.office.devices.printer` |
| Router | `shape=mxgraph.office.devices.router` |
| Session Border Controller | `shape=mxgraph.office.devices.session_border_controller` |
| Switch | `shape=mxgraph.office.devices.switch` |
| Video Camera | `shape=mxgraph.office.devices.video_camera` |
| Video Gateway | `shape=mxgraph.office.devices.video_gateway` |

#### Variações de Cores (fillColor)
Os ícones do Office Devices suportam variações de cores através do atributo `fillColor`:
| Cor | fillColor |
|-----|-----------|
| Cinza (padrão) | `fillColor=#505050` |
| Azul | `fillColor=#2072B8` |
| Vermelho | `fillColor=#DA4026` |
| Verde | `fillColor=#7FBA42` |
| Cinza Claro | `fillColor=#CCCBCB` |

### AV. Microsoft Office - Security (mxgraph.office.security)
| Componente | Style (identificador) |
|------------|----------------------|
| Active Directory | `shape=mxgraph.office.security.active_directory` |
| Active Directory Federated Services | `shape=mxgraph.office.security.active_directory_federated_services` |
| Address Book Policies | `shape=mxgraph.office.security.address_book_policies` |
| Certificate | `shape=mxgraph.office.security.certificate` |
| Credentials | `shape=mxgraph.office.security.credentials` |
| Domain | `shape=mxgraph.office.security.domain` |
| Email Address Policy | `shape=mxgraph.office.security.email_address_policy` |
| Federation Service | `shape=mxgraph.office.security.federation_service` |
| Federation Trust | `shape=mxgraph.office.security.federation_trust` |
| IRM Protected Message | `shape=mxgraph.office.security.irm_protected_message` |
| Key Permissions | `shape=mxgraph.office.security.key_permissions` |
| Lock Protected | `shape=mxgraph.office.security.lock_protected` |
| Lock Unprotected | `shape=mxgraph.office.security.lock_unprotected` |
| Lock With Key Security | `shape=mxgraph.office.security.lock_with_key_security` |
| Lock With Key Security (Blue) | `shape=mxgraph.office.security.lock_with_key_security_blue` |
| Lock With Key Security (Green) | `shape=mxgraph.office.security.lock_with_key_security_green` |
| Lock With Key Security (Orange) | `shape=mxgraph.office.security.lock_with_key_security_orange` |
| Lock With Key Security (Ghosted) | `shape=mxgraph.office.security.lock_with_key_security_ghosted` |
| Management Role | `shape=mxgraph.office.security.management_role` |
| Policy | `shape=mxgraph.office.security.policy` |
| Protected Voice Mail | `shape=mxgraph.office.security.protected_voice_mail` |
| Retention Policy | `shape=mxgraph.office.security.retention_policy` |
| Retention Policy Tag | `shape=mxgraph.office.security.retention_policy_tag` |
| Role Assignment Policy | `shape=mxgraph.office.security.role_assignment_policy` |
| Role Group | `shape=mxgraph.office.security.role_group` |
| Secure Messaging | `shape=mxgraph.office.security.secure_messaging` |
| Security Access Portal | `shape=mxgraph.office.security.security_access_portal` |
| Sharing Policy | `shape=mxgraph.office.security.sharing_policy` |
| Split Domain User | `shape=mxgraph.office.security.split_domain_user` |
| Token | `shape=mxgraph.office.security.token` |
| Token Service | `shape=mxgraph.office.security.token_service` |
| Trusted Application Server | `shape=mxgraph.office.security.trusted_application_server` |
| UM Mailbox Policy | `shape=mxgraph.office.security.um_mailbox_policy` |
| Universal Security Group | `shape=mxgraph.office.security.universal_security_group` |

#### Variações de Cores (fillColor)
Os ícones do Office Security suportam variações de cores através do atributo `fillColor`:
| Cor | fillColor |
|-----|-----------|
| Cinza (padrão) | `fillColor=#505050` |
| Azul | `fillColor=#2072B8` |
| Vermelho | `fillColor=#DA4026` |
| Verde | `fillColor=#7FBA42` |
| Cinza Claro | `fillColor=#CCCBCB` |

### AW. Microsoft Office - Servers (mxgraph.office.servers)
| Componente | Style (identificador) |
|------------|----------------------|
| 3rd Party Mail Server | `shape=mxgraph.office.servers.3rd_party_mail_server` |
| Active Directory Federation Services Proxy | `shape=mxgraph.office.servers.active_directory_federation_services_proxy` |
| Active Directory Federation Services Server | `shape=mxgraph.office.servers.active_directory_federation_services_server` |
| Active Directory Federation Services Server (Blue) | `shape=mxgraph.office.servers.active_directory_federation_services_server_blue` |
| Active Directory Federation Services Server (Green) | `shape=mxgraph.office.servers.active_directory_federation_services_server_green` |
| Active Directory Federation Services Server (Orange) | `shape=mxgraph.office.servers.active_directory_federation_services_server_orange` |
| Active Directory Federation Services Server (Ghosted) | `shape=mxgraph.office.servers.active_directory_federation_services_server_ghosted` |
| Application Server | `shape=mxgraph.office.servers.application_server` |
| Application Server (Blue) | `shape=mxgraph.office.servers.application_server_blue` |
| Application Server (Green) | `shape=mxgraph.office.servers.application_server_green` |
| Application Server (Orange) | `shape=mxgraph.office.servers.application_server_orange` |
| Application Server (Ghosted) | `shape=mxgraph.office.servers.application_server_ghosted` |
| Call Admission Control Service | `shape=mxgraph.office.servers.call_admission_control_service` |
| Certificate Authority | `shape=mxgraph.office.servers.certificate_authority` |
| Cluster Server | `shape=mxgraph.office.servers.cluster_server` |
| Database Server | `shape=mxgraph.office.servers.database_server` |
| Database Server (Blue) | `shape=mxgraph.office.servers.database_server_blue` |
| Database Server (Green) | `shape=mxgraph.office.servers.database_server_green` |
| Database Server (Orange) | `shape=mxgraph.office.servers.database_server_orange` |
| Database Server (Ghosted) | `shape=mxgraph.office.servers.database_server_ghosted` |
| Datacenter | `shape=mxgraph.office.servers.datacenter` |
| DirSync Server | `shape=mxgraph.office.servers.dirsync_server` |
| Domain Controller | `shape=mxgraph.office.servers.domain_controller` |
| Exchange Client Access Server | `shape=mxgraph.office.servers.exchange_client_access_server` |
| Exchange Client Access Server Role | `shape=mxgraph.office.servers.excahnge_client_access_server_role` |
| Exchange Edge Transport Server | `shape=mxgraph.office.servers.exchange_edge_transport_server` |
| Exchange Edge Transport Server Role | `shape=mxgraph.office.servers.exchange_edge_transport_server_role` |
| Exchange Hub Transport Server Role | `shape=mxgraph.office.servers.exchange_hub_transport_server_role` |
| Exchange Mailbox Server | `shape=mxgraph.office.servers.exchange_mailbox_server` |
| Exchange Mailbox Server Role | `shape=mxgraph.office.servers.exchange_mailbox_server_role` |
| Exchange Server | `shape=mxgraph.office.servers.exchange_server` |
| Exchange UM Server Role | `shape=mxgraph.office.servers.exchange_um_server_role` |
| File Server | `shape=mxgraph.office.servers.file_server` |
| Hybrid Server | `shape=mxgraph.office.servers.hybrid_server` |
| Mainframe | `shape=mxgraph.office.servers.mainframe` |
| Mainframe Host | `shape=mxgraph.office.servers.mainframe_host` |
| Monitoring SQL Reporting Services | `shape=mxgraph.office.servers.monitoring_sql_reporting_services` |
| Network | `shape=mxgraph.office.servers.network` |
| Office Web Apps Server | `shape=mxgraph.office.servers.office_web_apps_server` |
| On Premises Server | `shape=mxgraph.office.servers.on_premises_server` |
| Physical Host | `shape=mxgraph.office.servers.physical_host` |
| Physical Host Farm | `shape=mxgraph.office.servers.physical_host_farm` |
| Reverse Proxy | `shape=mxgraph.office.servers.reverse_proxy` |
| SCOM | `shape=mxgraph.office.servers.scom` |
| Server Disaster | `shape=mxgraph.office.servers.server_disaster` |
| Server Farm | `shape=mxgraph.office.servers.server_farm` |
| Server Generic | `shape=mxgraph.office.servers.server_generic` |
| Server Side Code | `shape=mxgraph.office.servers.server_side_code` |
| SharePoint Server | `shape=mxgraph.office.servers.sharepoint_server` |
| Skype for Business Back End Server | `shape=mxgraph.office.servers.skype_for_business_back_end_server` |
| Skype for Business Back End Server Mirror | `shape=mxgraph.office.servers.skype_for_business_back_end_server_mirror` |
| Skype for Business Director | `shape=mxgraph.office.servers.skype_for_business_director` |
| Skype for Business Director Array | `shape=mxgraph.office.servers.skype_for_business_director_array` |
| Skype for Business Edge Server | `shape=mxgraph.office.servers.skype_for_business_edge_server` |
| Skype for Business Edge Server Pool | `shape=mxgraph.office.servers.skype_for_business_edge_server_pool` |
| Skype for Business Front End Pool | `shape=mxgraph.office.servers.skype_for_business_front_end_pool` |
| SQL Server | `shape=mxgraph.office.servers.sql_server` |
| Survivable Branch Appliance | `shape=mxgraph.office.servers.survivable_branch_appliance` |
| Survivable Branch Server | `shape=mxgraph.office.servers.survivable_branch_server` |
| Topology Builder | `shape=mxgraph.office.servers.topology_builder` |
| Trusted Application Pool | `shape=mxgraph.office.servers.trusted_application_pool` |
| Trusted Application Server | `shape=mxgraph.office.servers.trusted_application_server` |
| Tunnel Angled | `shape=mxgraph.office.servers.tunnel_angled` |
| Tunnel Straight | `shape=mxgraph.office.servers.tunnel_straight` |
| Universal Security Group | `shape=mxgraph.office.servers.universal_security_group` |
| Video Interop Server | `shape=mxgraph.office.servers.video_interop_server` |
| Virtual Application Server | `shape=mxgraph.office.servers.virtual_application_server` |
| Virtual Database Server | `shape=mxgraph.office.servers.virtual_database_server` |
| Virtual Server | `shape=mxgraph.office.servers.virtual_server` |
| Virtual Web Server | `shape=mxgraph.office.servers.virtual_web_server` |
| Voicemail Preview Partner | `shape=mxgraph.office.servers.vociemail_preview_partner` |
| Web Server (Ghosted) | `shape=mxgraph.office.servers.web_server_ghosted` |
| Web Server (Green) | `shape=mxgraph.office.servers.web_server_green` |

#### Variações de Cores (fillColor)
Os ícones do Office Servers suportam variações de cores através do atributo `fillColor`:
| Cor | fillColor |
|-----|-----------|
| Cinza (padrão) | `fillColor=#505050` |
| Azul | `fillColor=#2072B8` |
| Vermelho | `fillColor=#DA4026` |
| Verde | `fillColor=#7FBA42` |
| Cinza Claro | `fillColor=#CCCBCB` |

### AX. Microsoft Office - Services (mxgraph.office.services)
| Componente | Style (identificador) |
|------------|----------------------|
| 3rd Party Service | `shape=mxgraph.office.services.3rd_party_service` |
| Access Services | `shape=mxgraph.office.services.access_services` |
| Business Connectivity Services | `shape=mxgraph.office.services.business_connectivity_services` |
| Call Admission Control Service | `shape=mxgraph.office.services.call_admission_control_service` |
| Central Management Service | `shape=mxgraph.office.services.central_management_service` |
| Conference Announcement Service | `shape=mxgraph.office.services.conference_announcement_service` |
| Device Update Service | `shape=mxgraph.office.services.device_update_service` |
| Email Service | `shape=mxgraph.office.services.email_service` |
| Excel Services | `shape=mxgraph.office.services.excel_services` |
| Federation Service | `shape=mxgraph.office.services.federation_service` |
| Lync Storage Service | `shape=mxgraph.office.services.lync_storage_service` |
| Lync Web App Client | `shape=mxgraph.office.services.lync_web_app_client` |
| Mobility Service | `shape=mxgraph.office.services.mobility_service` |
| Network File Share Service | `shape=mxgraph.office.services.network_file_share_service` |
| Online Hosted Services | `shape=mxgraph.office.services.online_hosted_services` |
| Outlook Web App | `shape=mxgraph.office.services.outlook_web_app` |
| PowerPoint Automation Services | `shape=mxgraph.office.services.powerpoint_automation_services` |
| Push Notification Service | `shape=mxgraph.office.services.push_notification_service` |
| Registrar Service | `shape=mxgraph.office.services.registrar_service` |
| Response Group Service | `shape=mxgraph.office.services.response_group_service` |
| Skype for Business Storage Service | `shape=mxgraph.office.services.skype_for_business_storage_service` |
| User Services | `shape=mxgraph.office.services.user_services` |
| Verification Service | `shape=mxgraph.office.services.verification_service` |
| Web Services | `shape=mxgraph.office.services.web_services` |
| Word Automation Services | `shape=mxgraph.office.services.word_automation_services` |
| XMPP Service | `shape=mxgraph.office.services.xmpp_service` |

#### Variações de Cores (fillColor)
Os ícones do Office Services suportam variações de cores através do atributo `fillColor`:
| Cor | fillColor |
|-----|-----------|
| Cinza (padrão) | `fillColor=#505050` |
| Azul | `fillColor=#2072B8` |
| Vermelho | `fillColor=#DA4026` |
| Verde | `fillColor=#7FBA42` |
| Cinza Claro | `fillColor=#CCCBCB` |

### AY. Microsoft Office - Sites (mxgraph.office.sites)
| Componente | Style (identificador) |
|------------|----------------------|
| Access Services | `shape=mxgraph.office.sites.access_services` |
| Blog Site | `shape=mxgraph.office.sites.blog_site` |
| Business Connectivity Services | `shape=mxgraph.office.sites.business_connectivity_services` |
| Excel Services | `shape=mxgraph.office.sites.excel_services` |
| Meeting Workspace Site | `shape=mxgraph.office.sites.meeting_workspace_site` |
| My Site | `shape=mxgraph.office.sites.my_site` |
| PowerPoint Automation Services | `shape=mxgraph.office.sites.powerpoint_automation_services` |
| Publish | `shape=mxgraph.office.sites.publish` |
| Site Collection | `shape=mxgraph.office.sites.site_collection` |
| Site Shared | `shape=mxgraph.office.sites.site_shared` |
| Site Team | `shape=mxgraph.office.sites.site_team` |
| Subsite | `shape=mxgraph.office.sites.subsite` |
| Upgrade Site | `shape=mxgraph.office.sites.upgrade_site` |
| Website | `shape=mxgraph.office.sites.website` |
| Website Public | `shape=mxgraph.office.sites.website_public` |
| Wiki Site | `shape=mxgraph.office.sites.wiki_site` |
| Word Automation Services | `shape=mxgraph.office.sites.word_automation_services` |

#### Variações de Cores (fillColor)
Os ícones do Office Sites suportam variações de cores através do atributo `fillColor`:
| Cor | fillColor |
|-----|-----------|
| Cinza (padrão) | `fillColor=#505050` |
| Azul | `fillColor=#2072B8` |
| Vermelho | `fillColor=#DA4026` |
| Verde | `fillColor=#7FBA42` |
| Cinza Claro | `fillColor=#CCCBCB` |

### AZ. Microsoft Office - Users (mxgraph.office.users)
| Componente | Style (identificador) |
|------------|----------------------|
| Administrator | `shape=mxgraph.office.users.administrator` |
| Call Center Agent | `shape=mxgraph.office.users.call_center_agent` |
| Communications | `shape=mxgraph.office.users.communications` |
| Conferencing Attendant | `shape=mxgraph.office.users.conferencing_attendant` |
| Credentials | `shape=mxgraph.office.users.credentials` |
| CSV File | `shape=mxgraph.office.users.csv_file` |
| Distribution Group | `shape=mxgraph.office.users.distribution_group` |
| Dynamic Distribution Group | `shape=mxgraph.office.users.dynamic_distribution_group` |
| Mail User | `shape=mxgraph.office.users.mail_user` |
| Meeting | `shape=mxgraph.office.users.meeting` |
| Mobile User | `shape=mxgraph.office.users.mobile_user` |
| On Premises User | `shape=mxgraph.office.users.on_premises_user` |
| Online User | `shape=mxgraph.office.users.online_user` |
| Outlook User | `shape=mxgraph.office.users.outlook_user` |
| UM Enabled User | `shape=mxgraph.office.users.um_enabled_user` |
| Universal Security Group | `shape=mxgraph.office.users.universal_security_group` |
| User | `shape=mxgraph.office.users.user` |
| Users | `shape=mxgraph.office.users.users` |

#### Variações de Cores (fillColor)
Os ícones do Office Users suportam variações de cores através do atributo `fillColor`:
| Cor | fillColor |
|-----|-----------|
| Cinza (padrão) | `fillColor=#505050` |
| Azul | `fillColor=#2072B8` |
| Vermelho | `fillColor=#DA4026` |
| Verde | `fillColor=#7FBA42` |
| Cinza Claro | `fillColor=#CCCBCB` |

### BA. Infographic Shapes (mxgraph.infographic)
| Componente | Style (identificador) |
|------------|----------------------|
| Parallelogram | `shape=mxgraph.infographic.parallelogram` |
| Ribbon Simple | `shape=mxgraph.infographic.ribbonSimple` |
| Banner | `shape=mxgraph.infographic.banner` |
| Ribbon Back Folded | `shape=mxgraph.infographic.ribbonBackFolded` |
| Ribbon Front Folded | `shape=mxgraph.infographic.ribbonFrontFolded` |
| Ribbon Double Folded | `shape=mxgraph.infographic.ribbonDoubleFolded` |
| Ribbon Rolled | `shape=mxgraph.infographic.ribbonRolled` |
| Banner Single Fold | `shape=mxgraph.infographic.bannerSingleFold` |
| Banner Half Fold | `shape=mxgraph.infographic.bannerHalfFold` |
| Bar Callout | `shape=mxgraph.infographic.barCallout` |
| Flag | `shape=mxgraph.infographic.flag` |
| Shaded Triangle | `shape=mxgraph.infographic.shadedTriangle` |
| Shaded Cube | `shape=mxgraph.infographic.shadedCube` |
| Cylinder | `shape=mxgraph.infographic.cylinder` |
| Pyramid Step | `shape=mxgraph.infographic.pyramidStep` |
| Shaded Pyramid | `shape=mxgraph.infographic.shadedPyramid` |
| Circular Dial | `shape=mxgraph.infographic.circularDial` |
| Numbered Entry Vert | `shape=mxgraph.infographic.numberedEntryVert` |
| Bending Arch | `shape=mxgraph.infographic.bendingArch` |
| Circular Callout | `shape=mxgraph.infographic.circularCallout` |
| Circular Callout 2 | `shape=mxgraph.infographic.circularCallout2` |
| Part Conc Ellipse | `shape=mxgraph.infographic.partConcEllipse` |

#### Parâmetros Especiais
Os componentes Infographic suportam diversos parâmetros especiais:
| Parâmetro | Descrição |
|-----------|-----------|
| `dx` | Deslocamento horizontal |
| `dy` | Deslocamento vertical |
| `notch1`, `notch2` | Entalhe para ribbons |
| `startAngle`, `endAngle` | Ângulos para formas circulares (0-1) |
| `arcWidth` | Largura do arco para elipses concêntricas |
| `isoAngle` | Ângulo isométrico para cubos |

### BB. Basic Shapes Avançados (mxgraph.basic)
| Componente | Style (identificador) |
|------------|----------------------|
| Pie | `shape=mxgraph.basic.pie` |
| Arc | `shape=mxgraph.basic.arc` |
| Part Conc Ellipse | `shape=mxgraph.basic.partConcEllipse` |
| Donut | `shape=mxgraph.basic.donut` |
| Three Corner Round Rect | `shape=mxgraph.basic.three_corner_round_rect` |

#### Parâmetros Especiais
| Parâmetro | Descrição |
|-----------|-----------|
| `startAngle`, `endAngle` | Ângulos de início e fim (0-1) |
| `arcWidth` | Largura do arco |
| `dx` | Deslocamento/arredondamento |
| `strokeWidth` | Espessura da linha |

### BC. Arrows 2 (mxgraph.arrows2)
| Componente | Style (identificador) |
|------------|----------------------|
| Arrow | `shape=mxgraph.arrows2.arrow` |

#### Parâmetros Especiais
| Parâmetro | Descrição |
|-----------|-----------|
| `dy` | Largura da seta (0-1) |
| `dx` | Comprimento da ponta |
| `notch` | Entalhe na base |
| `direction` | Direção: `north`, `south`, `east`, `west` |

### BD. Formas Geométricas Nativas
| Componente | Style (identificador) |
|------------|----------------------|
| Step (Seta de Processo) | `shape=step;perimeter=stepPerimeter` |
| Hexagon | `shape=hexagon` |
| Triangle | `triangle;direction=north` |
| Ellipse | `ellipse` |
| Rectangle (Rounded) | `rounded=1;arcSize=XX` |

#### Parâmetros Comuns
| Parâmetro | Descrição |
|-----------|-----------|
| `size` | Tamanho do entalhe (para step) |
| `direction` | Direção: `north`, `south`, `east`, `west` |
| `fixedSize=1` | Fixa o tamanho do entalhe |
| `arcSize` | Arredondamento dos cantos |
| `strokeWidth` | Espessura da borda |
| `shadow=0/1` | Ativar/desativar sombra |

### BE. Paleta de Cores Infográficos
Cores frequentemente usadas em infográficos:
| Nome | Código Hex | Uso |
|------|------------|-----|
| Azul Primário | `#10739E` | Destaque principal |
| Azul Claro | `#1699D3` | Destaque secundário |
| Azul Muito Claro | `#64BBE2` | Background |
| Azul Background | `#B1DDF0` | Fundo suave |
| Laranja | `#F2931E` | Destaque de atenção |
| Laranja Claro | `#F5AB50` | Secundário |
| Laranja Background | `#F8C382` | Fundo |
| Laranja Muito Claro | `#FCE7CD` | Fundo suave |
| Vermelho | `#AE4132` | Alerta/Erro |
| Vermelho Claro | `#E85642` | Destaque |
| Vermelho Background | `#F08E81` | Fundo |
| Vermelho Muito Claro | `#FAD9D5` | Fundo suave |
| Azul Escuro | `#23445D` | Texto/Títulos |
| Azul Médio | `#2F5B7C` | Subtítulos |
| Azul Acinzentado | `#5D7F99` | Texto secundário |
| Azul Background | `#BAC8D3` | Fundo neutro |
| Teal | `#12AAB5` | Destaque alternativo |
| Teal Claro | `#61C6CE` | Secundário |
| Teal Background | `#B0E3E6` | Fundo |
| Verde | `#15AA96` | Sucesso |
| Cinza Escuro | `#333333` | Texto |
| Cinza Médio | `#444444` | Texto secundário |
| Cinza | `#777777` | Desabilitado |
| Cinza Claro | `#909090` | Placeholder |
| Cinza Background | `#CCCCCC` | Labels |
| Cinza Muito Claro | `#DDDDDD` | Background |
| Cinza Ultra Claro | `#EEEEEE` | Cards |
| Roxo | `#736CA8` | Destaque especial |

### BF. Web Icons - Logos e Ícones de Marcas (mxgraph.webicons)
Ícones de marcas, logos de empresas e serviços web.

| Componente | Style (identificador) |
|------------|----------------------|
| Adfty | `shape=mxgraph.webicons.adfty` |
| Adobe PDF | `shape=mxgraph.webicons.adobe_pdf` |
| Allvoices | `shape=mxgraph.webicons.allvoices` |
| Amazon | `shape=mxgraph.webicons.amazon` |
| Amazon 2 | `shape=mxgraph.webicons.amazon_2` |
| Android | `shape=mxgraph.webicons.android` |
| Apache | `shape=mxgraph.webicons.apache` |
| Apple | `shape=mxgraph.webicons.apple` |
| Apple Classic | `shape=mxgraph.webicons.apple_classic` |
| Arduino | `shape=mxgraph.webicons.arduino` |
| Ask | `shape=mxgraph.webicons.ask` |
| Atlassian | `shape=mxgraph.webicons.atlassian` |
| Audioboo | `shape=mxgraph.webicons.audioboo` |
| AWS | `shape=mxgraph.webicons.aws` |
| AWS S3 | `shape=mxgraph.webicons.aws_s3` |
| Baidu | `shape=mxgraph.webicons.baidu` |
| Bebo | `shape=mxgraph.webicons.bebo` |
| Behance | `shape=mxgraph.webicons.behance` |
| Bing | `shape=mxgraph.webicons.bing` |
| Bitbucket | `shape=mxgraph.webicons.bitbucket` |
| Blinklist | `shape=mxgraph.webicons.blinklist` |
| Blogger | `shape=mxgraph.webicons.blogger` |
| Blogmarks | `shape=mxgraph.webicons.blogmarks` |
| Bookmarks.fr | `shape=mxgraph.webicons.bookmarks.fr` |
| Box | `shape=mxgraph.webicons.box` |
| Buddymarks | `shape=mxgraph.webicons.buddymarks` |
| Buffer | `shape=mxgraph.webicons.buffer` |
| Buzzfeed | `shape=mxgraph.webicons.buzzfeed` |
| Chrome | `shape=mxgraph.webicons.chrome` |
| Citeulike | `shape=mxgraph.webicons.citeulike` |
| Confluence | `shape=mxgraph.webicons.confluence` |
| Connotea | `shape=mxgraph.webicons.connotea` |
| Dealsplus | `shape=mxgraph.webicons.dealsplus` |
| Delicious | `shape=mxgraph.webicons.delicious` |
| Designfloat | `shape=mxgraph.webicons.designfloat` |
| Deviantart | `shape=mxgraph.webicons.deviantart` |
| Digg | `shape=mxgraph.webicons.digg` |
| Diigo | `shape=mxgraph.webicons.diigo` |
| Dopplr | `shape=mxgraph.webicons.dopplr` |
| Draw.io | `shape=mxgraph.webicons.drawio2` |
| Dribbble | `shape=mxgraph.webicons.dribbble` |
| Dropbox | `shape=mxgraph.webicons.dropbox` |
| Dropbox 2 | `shape=mxgraph.webicons.dropbox2` |
| Drupal | `shape=mxgraph.webicons.drupal` |
| Dzone | `shape=mxgraph.webicons.dzone` |
| eBay | `shape=mxgraph.webicons.ebay` |
| Edmodo | `shape=mxgraph.webicons.edmodo` |
| Evernote | `shape=mxgraph.webicons.evernote` |
| Facebook | `shape=mxgraph.webicons.facebook` |
| Fancy | `shape=mxgraph.webicons.fancy` |
| Fark | `shape=mxgraph.webicons.fark` |
| Fashiolista | `shape=mxgraph.webicons.fashiolista` |
| Feed | `shape=mxgraph.webicons.feed` |
| Feedburner | `shape=mxgraph.webicons.feedburner` |
| Flickr | `shape=mxgraph.webicons.flickr` |
| Folkd | `shape=mxgraph.webicons.folkd` |
| Forrst | `shape=mxgraph.webicons.forrst` |
| Fotolog | `shape=mxgraph.webicons.fotolog` |
| Freshbump | `shape=mxgraph.webicons.freshbump` |
| Fresqui | `shape=mxgraph.webicons.fresqui` |
| Friendfeed | `shape=mxgraph.webicons.friendfeed` |
| Funp | `shape=mxgraph.webicons.funp` |
| Fwisp | `shape=mxgraph.webicons.fwisp` |
| Gabbr | `shape=mxgraph.webicons.gabbr` |
| Gamespot | `shape=mxgraph.webicons.gamespot` |
| GitHub | `shape=mxgraph.webicons.github` |
| Gmail | `shape=mxgraph.webicons.gmail` |
| Google | `shape=mxgraph.webicons.google` |
| Google Drive | `shape=mxgraph.webicons.google_drive` |
| Google Hangout | `shape=mxgraph.webicons.google_hangout` |
| Google Photos | `shape=mxgraph.webicons.google_photos` |
| Google Play | `shape=mxgraph.webicons.google_play` |
| Google Play Light | `shape=mxgraph.webicons.google_play_light` |
| Google Plus | `shape=mxgraph.webicons.google_plus` |
| Grooveshark | `shape=mxgraph.webicons.grooveshark` |
| Hatena | `shape=mxgraph.webicons.hatena` |
| HTML5 | `shape=mxgraph.webicons.html5` |
| Identi.ca | `shape=mxgraph.webicons.identi.ca` |
| Instagram | `shape=mxgraph.webicons.instagram` |
| Instapaper | `shape=mxgraph.webicons.instapaper` |
| iOS | `shape=mxgraph.webicons.ios` |
| Jamespot | `shape=mxgraph.webicons.jamespot` |
| Java | `shape=mxgraph.webicons.java` |
| Joomla | `shape=mxgraph.webicons.joomla` |
| jQuery | `shape=mxgraph.webicons.jquery` |
| JSON | `shape=mxgraph.webicons.json` |
| JSON 2 | `shape=mxgraph.webicons.json_2` |
| Last.fm | `shape=mxgraph.webicons.last.fm` |
| Linkagogo | `shape=mxgraph.webicons.linkagogo` |
| LinkedIn | `shape=mxgraph.webicons.linkedin` |
| Livejournal | `shape=mxgraph.webicons.livejournal` |
| Mail.ru | `shape=mxgraph.webicons.mail.ru` |
| Meetup | `shape=mxgraph.webicons.meetup` |
| Meneame | `shape=mxgraph.webicons.meneame` |
| Messenger | `shape=mxgraph.webicons.messenger` |
| Messenger 2 | `shape=mxgraph.webicons.messenger_2` |
| Messenger 3 | `shape=mxgraph.webicons.messenger_3` |
| Mind Body Green | `shape=mxgraph.webicons.mind_body_green` |
| MongoDB | `shape=mxgraph.webicons.mongodb` |
| Myspace | `shape=mxgraph.webicons.myspace` |
| N4G | `shape=mxgraph.webicons.n4g` |
| Netlog | `shape=mxgraph.webicons.netlog` |
| Networkedblogs | `shape=mxgraph.webicons.networkedblogs` |
| Netvibes | `shape=mxgraph.webicons.netvibes` |
| Netvouz | `shape=mxgraph.webicons.netvouz` |
| Newsvine | `shape=mxgraph.webicons.newsvine` |
| Odnoklassniki | `shape=mxgraph.webicons.odnoklassniki` |
| Oknotizie | `shape=mxgraph.webicons.oknotizie` |
| OneDrive | `shape=mxgraph.webicons.onedrive` |
| Oracle | `shape=mxgraph.webicons.oracle` |
| PayPal | `shape=mxgraph.webicons.paypal` |
| Phone | `shape=mxgraph.webicons.phone` |
| Phonefavs | `shape=mxgraph.webicons.phonefavs` |
| Pinterest | `shape=mxgraph.webicons.pinterest` |
| Plaxo | `shape=mxgraph.webicons.plaxo` |
| Playfire | `shape=mxgraph.webicons.playfire` |
| Plurk | `shape=mxgraph.webicons.plurk` |
| Pocket | `shape=mxgraph.webicons.pocket` |
| Protopage | `shape=mxgraph.webicons.protopage` |
| Readernaut | `shape=mxgraph.webicons.readernaut` |
| Reddit | `shape=mxgraph.webicons.reddit` |
| RSS | `shape=mxgraph.webicons.rss` |
| Scoopit | `shape=mxgraph.webicons.scoopit` |
| Scribd | `shape=mxgraph.webicons.scribd` |
| Segnalo | `shape=mxgraph.webicons.segnalo` |
| Sina | `shape=mxgraph.webicons.sina` |
| Sitejot | `shape=mxgraph.webicons.sitejot` |
| Skype | `shape=mxgraph.webicons.skype` |
| Skyrock | `shape=mxgraph.webicons.skyrock` |
| Slashdot | `shape=mxgraph.webicons.slashdot` |
| SMS | `shape=mxgraph.webicons.sms` |
| Socialvibe | `shape=mxgraph.webicons.socialvibe` |
| Society6 | `shape=mxgraph.webicons.society6` |
| Sonico | `shape=mxgraph.webicons.sonico` |
| Soundcloud | `shape=mxgraph.webicons.soundcloud` |
| Sourceforge | `shape=mxgraph.webicons.sourceforge` |
| Sourceforge 2 | `shape=mxgraph.webicons.sourceforge_2` |
| Spring.me | `shape=mxgraph.webicons.spring.me` |
| Stackexchange | `shape=mxgraph.webicons.stackexchange` |
| Stackoverflow | `shape=mxgraph.webicons.stackoverflow` |
| Startaid | `shape=mxgraph.webicons.startaid` |
| Startlap | `shape=mxgraph.webicons.startlap` |
| Steam | `shape=mxgraph.webicons.steam` |
| Stumbleupon | `shape=mxgraph.webicons.stumbleupon` |
| Stumpedia | `shape=mxgraph.webicons.stumpedia` |
| Technorati | `shape=mxgraph.webicons.technorati` |
| Translate | `shape=mxgraph.webicons.translate` |
| Tumblr | `shape=mxgraph.webicons.tumblr` |
| Tunein | `shape=mxgraph.webicons.tunein` |
| Twitter | `shape=mxgraph.webicons.twitter` |
| Two | `shape=mxgraph.webicons.two` |
| Typepad | `shape=mxgraph.webicons.typepad` |
| Viber | `shape=mxgraph.webicons.viber` |
| Viadeo | `shape=mxgraph.webicons.viadeo` |
| Viddler | `shape=mxgraph.webicons.viddler` |
| Vimeo | `shape=mxgraph.webicons.vimeo` |
| Virb | `shape=mxgraph.webicons.virb` |
| Vkontakte | `shape=mxgraph.webicons.vkontakte` |
| Wakoopa | `shape=mxgraph.webicons.wakoopa` |
| WeHeartIt | `shape=mxgraph.webicons.weheartit` |
| WhatsApp | `shape=mxgraph.webicons.whatsapp` |
| Wix | `shape=mxgraph.webicons.wix` |
| Wordpress | `shape=mxgraph.webicons.wordpress` |
| Wordpress 2 | `shape=mxgraph.webicons.wordpress_2` |
| Xanga | `shape=mxgraph.webicons.xanga` |
| Xerpi | `shape=mxgraph.webicons.xerpi` |
| Xing | `shape=mxgraph.webicons.xing` |
| Yahoo | `shape=mxgraph.webicons.yahoo` |
| Yahoo 2 | `shape=mxgraph.webicons.yahoo_2` |
| Yelp | `shape=mxgraph.webicons.yelp` |
| Yoolink | `shape=mxgraph.webicons.yoolink` |
| Youmob | `shape=mxgraph.webicons.youmob` |
| YouTube | `shape=mxgraph.webicons.youtube` |

#### Parâmetros Comuns para Web Icons
| Parâmetro | Descrição |
|-----------|-----------|
| `fillColor` | Cor de preenchimento principal |
| `gradientColor` | Cor secundária para degradê |
| `dashed=0` | Borda sólida (padrão) |
| `outlineConnect=0` | Conexão sem outline |

#### Categorias de Web Icons
| Categoria | Exemplos |
|-----------|----------|
| Redes Sociais | Facebook, Twitter, Instagram, LinkedIn, Pinterest |
| Desenvolvimento | GitHub, Bitbucket, Stackoverflow, HTML5, Java, JSON |
| Armazenamento | Dropbox, Google Drive, OneDrive, Box, AWS S3 |
| Comunicação | WhatsApp, Skype, Messenger, Viber, SMS |
| Google Services | Gmail, Google, Google Plus, Google Photos, Google Play |
| Blogs/CMS | Wordpress, Blogger, Tumblr, Drupal, Joomla |
| Mídia | YouTube, Vimeo, Soundcloud, Spotify |
| Empresas Tech | Amazon, Apple, Microsoft, Oracle, Adobe |
| Bookmarking | Delicious, Reddit, Digg, Pocket, Evernote |

