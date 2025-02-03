import React, { useState } from 'react';
import { Select } from 'antd';
import { Button, Row, Col, Modal, Input, Form, List, message, Space } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Botoes_Completos = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form] = Form.useForm();

    const baseURL = "http://localhost:5085/api/produto";

    const fetchTodosProdutos = async () => {
        try {
            const response = await fetch(baseURL);
            const data = await response.json();
            setProducts(data.dadosProdutos);
        } catch (error) {
            message.error(error);
        }
    };
    
    const fetchProdutoPorId = async (id) => {
        try {
            const response = await fetch(`${baseURL}/id/${id}`);
            if (!response.ok) {
                throw new Error('Produto não encontrado');
            }
            const data = await response.json();
            console.log(data.dadosProdutos.disponível);
            return data.dadosProdutos;
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    
    const fetchProdutoPorNome = async (nome) => {
        try {
            const response = await fetch(`${baseURL}/nome/${nome}`);
            if (!response.ok) {
                throw new Error('Produto não encontrado');
            }
            const data = await response.json();
            return data.dadosProdutos;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    };
    
    const fetchDeletarProdutoPorId = async (id) => {
        try {
            const response = await fetch(`${baseURL}/idDeletar/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Produto não encontrado.');
                }
                throw new Error('Erro ao deletar o produto.');
            }
            const data = await response.json();
            return data.message || 'Produto deletado com sucesso!';
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    };
    
    const fetchDeletarProdutoPorNome = async (nome) => {
        try {
            const response = await fetch(`${baseURL}/nomeDeletar/${nome}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Produto não encontrado.');
                }
                throw new Error('Erro ao deletar o produto.');
            }
            const data = await response.json();
            return data.message || 'Produto deletado com sucesso!';
        } catch (error) {
            console.error('Erro ao deletar produto:', error.message);
            throw error;
        }
    };    

    const showModal = (action) => {
        setCurrentAction(action);
        setIsModalOpen(true);
        if (action === 'mostrarTodos') fetchTodosProdutos();
    };
    
    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
        setSelectedProduct(null);
    };
    
    const [sortedProducts, setSortedProducts] = useState(products);
            const [sortOrder, setSortOrder] = useState('asc'); 
            
            const handleSort = (order) => {
                const sorted = [...products].sort((a, b) => {
                    if (order === 'asc') {
                        return a.preco - b.preco;
                    } else {
                        return b.preco - a.preco;
                    }
                });
                setSortedProducts(sorted);
                setSortOrder(order);
            };

    const renderModalContent = () => {
        switch (currentAction) {
        case 'mostrarTodos':
            return (
                <div>
                    <Button
                        onClick={() => handleSort('asc')}
                        type="primary"
                        size="large"
                        style={{ marginBottom: '10px' }}
                    >
                        Ordenar por Preço: Menor para Maior
                    </Button>
                    <Button
                        onClick={() => handleSort('desc')}
                        type="primary"
                        size="large"
                    >
                        Ordenar por Preço: Maior para Menor
                    </Button>

                    <List
                        dataSource={sortedProducts}
                        renderItem={(item) => (
                            <List.Item>
                                <strong>Id: {item.id} - {item.nome}</strong>: {item.descricao} | Preço: R${item.preco} | Disponível: {item.disponível === 1 ? 'Sim' : 'Não'}
                            </List.Item>
                        )}
                    />
                </div>
            );

            case 'procurarPorId':
                return (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Procura por Id"
                            name="idProduto"
                            rules={[{ required: true, message: 'Campo obrigatório.' }]}
                        >
                            <Input placeholder="Insira o id do produto" />
                        </Form.Item>
                        {selectedProduct && (
                            <div style={{ marginTop: '20px' }}>
                                <strong>Produto encontrado:</strong>
                                <pre>
                                    ID: {selectedProduct.id}
                                    <br />
                                    Nome: {selectedProduct.nome}
                                    <br />
                                    Descrição: {selectedProduct.descricao}
                                    <br />
                                    Preço: R${selectedProduct.preco}
                                    <br />
                                    Disponivel: {selectedProduct.disponivel === 1 ? 'Sim' : 'Não'}
                                </pre>
                            </div>
                        )}
                        <Button
                            type="primary"
                            onClick={async () => {
                                try {
                                    const values = await form.validateFields();
                                    const idProduto = values.idProduto;
                                    const retorno = await fetchProdutoPorId(idProduto);
                                    console.log(retorno);
    
                                    if (retorno) {
                                        setSelectedProduct({
                                            id: retorno.id,
                                            nome: retorno.nome,
                                            descricao: retorno.descricao,
                                            preco: retorno.preco,
                                            disponivel: retorno.disponível,
                                        });
                                        message.success('Produto encontrado.');
                                    } else {
                                        setSelectedProduct(null);
                                        message.warning('Produto não encontrado.');
                                    }
                                } catch (error) {
                                    console.error('Erro', error);
                                    message.error('Erro ao buscar o produto. Tente novamente.');
                                }
                            }}
                        >
                            Pesquisar
                        </Button>
                        {!selectedProduct && (
                            <p style={{ marginTop: '20px' }}>
                                Produto não encontrado ou ainda não pesquisado.
                            </p>
                        )}
                    </Form>
                );
            case 'procurarPorNome':
                return (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Procura por Nome"
                            name="nomeProduto"
                            rules={[{ required: true, message: 'Campo obrigatório.' }]}
                        >
                            <Input placeholder="Insira o nome do produto" />
                        </Form.Item>
                        {selectedProduct && (
                            <div style={{ marginTop: '20px' }}>
                                <strong>Produto encontrado:</strong>
                                <pre>
                                    ID: {selectedProduct.id}
                                    <br />
                                    Nome: {selectedProduct.nome}
                                    <br />
                                    Descrição: {selectedProduct.descricao}
                                    <br />
                                    Preço: R${selectedProduct.preco}
                                    <br />
                                    Disponivel: {selectedProduct.disponivel === 1? 'Sim' : 'Não'}
                                </pre>
                            </div>
                        )}
                        <Button
                            type="primary"
                            onClick={async () => {
                                try {
                                    const values = await form.validateFields();
                                    const nomeProduto = values.nomeProduto;
                                    const retorno = await fetchProdutoPorNome(nomeProduto);
    
                                    if (retorno) {
                                        setSelectedProduct({
                                            id: retorno.id,
                                            nome: retorno.nome,
                                            descricao: retorno.descricao,
                                            preco: retorno.preco,
                                            disponivel: retorno.disponível,
                                        });
                                        message.success('Produto encontrado.');
                                    } else {
                                        setSelectedProduct(null);
                                        message.warning('Produto não encontrado.');
                                    }
                                } catch (error) {
                                    console.error('Erro', error);
                                    message.error('Erro ao procurar o produto. Tente novamente.');
                                }
                            }}
                        >
                            Pesquisar
                        </Button>
                        {!selectedProduct && (
                            <p style={{ marginTop: '20px' }}>
                                Produto não encontrado ou ainda não pesquisado.
                            </p>
                        )}
                    </Form>
                );
                case 'adicionar':
                    return (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={async (values) => {
                                try {
                                    const response = await fetch(`${baseURL}`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            nome: values.NomeProduto,
                                            descricao: values.DescricaoProduto,
                                            preco: parseFloat(values.PrecoProduto),
                                            disponível: values.DisponivelProduto === 'sim' ? 1 : 0,
                                        }),
                                    });
                
                                    if (response.ok) {
                                        message.success('Produto adicionado com sucesso.');
                                        form.resetFields();
                                    } else {
                                        const errorData = await response.json();
                                        message.error(`Erro ao adicionar produto: ${errorData.message}`);
                                    }
                                } catch (error) {
                                    console.error('Erro', error);
                                    message.error('Erro ao adicionar produto. Tente novamente.');
                                }
                            }}
                        >
                            <Form.Item
                                label="Nome do Produto"
                                name="NomeProduto"
                                rules={[{ required: true, message: 'Por favor, insira o nome do produto.' }]}
                            >
                                <Input placeholder="Insira o nome do produto." />
                            </Form.Item>
                            <Form.Item
                                label="Descrição do Produto"
                                name="DescricaoProduto"
                                rules={[{ required: true, message: 'Por favor, insira a descrição do produto.' }]}
                            >
                                <Input placeholder="Insira a descrição do produto." />
                            </Form.Item>
                            <Form.Item
                                label="Preço do Produto"
                                name="PrecoProduto"
                                rules={[
                                    { required: true, message: 'Por favor, insira o preço do produto.' },
                                    { pattern: /^\d+(\.\d{1,2})?$/, message: 'Por favor, insira um valor válido.' },
                                ]}
                            >
                                <Input placeholder="Insira o preço do produto." />
                            </Form.Item>
                            <Form.Item
                                label="Disponível"
                                name="DisponivelProduto"
                                rules={[{ required: true, message: 'Por favor, selecione se o produto está disponível.' }]}
                            >
                                <Select>
                                    <Select.Option value="sim">Sim</Select.Option>
                                    <Select.Option value="nao">Não</Select.Option>
                                </Select>
                            </Form.Item>
                
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Adicionar Produto
                                </Button>
                            </Form.Item>
                        </Form>
                    );                
            case 'atualizarProdutoId':
                return (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={async (values) => {
                            try {
                                const response = await fetch(`${baseURL}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        id: values.idProduto,
                                        nome: values.NomeProduto,
                                        descricao: values.DescricaoProduto,
                                        preco: parseFloat(values.PrecoProduto),
                                        disponível: values.DisponivelProduto === 'sim' ? 1 : 0,
                                    }),
                                });
    
                                if (response.ok) {
                                    message.success('Produto atualizado com sucesso.');
                                    form.resetFields();
                                } else {
                                    const errorData = await response.json();
                                    message.error(`Erro ao atualizar produto: ${errorData.message}`);
                                }
                            } catch (error) {
                                console.error('Erro', error);
                                message.error('Erro ao atualizar produto. Tente novamente.');
                            }
                        }}
                    >
                        <Form.Item
                            label="Id do Produto"
                            name="idProduto"
                            rules={[{ required: true, message: 'Por favor, insira o id do produto.' }]}
                        >
                            <Input placeholder="Insira o id do produto." />
                        </Form.Item>
                        <Form.Item
                            label="Nome do Produto"
                            name="NomeProduto"
                            rules={[{ required: true, message: 'Por favor, insira o nome do produto.' }]}
                        >
                            <Input placeholder="Insira o nome do produto." />
                        </Form.Item>
                        <Form.Item
                            label="Descrição do Produto"
                            name="DescricaoProduto"
                            rules={[{ required: true, message: 'Por favor, insira a descrição do produto.' }]}
                        >
                            <Input placeholder="Insira a descrição do produto." />
                        </Form.Item>
                        <Form.Item
                            label="Preço do Produto"
                            name="PrecoProduto"
                            rules={[
                                { required: true, message: 'Por favor, insira o preço do produto.' },
                                { pattern: /^\d+(\.\d{1,2})?$/, message: 'Por favor, insira um valor válido.' },
                            ]}
                        >
                            <Input placeholder="Insira o preço do produto." />
                        </Form.Item>
                        <Form.Item
                            label="Disponível"
                            name="DisponivelProduto"
                            rules={[{ required: true, message: 'Por favor, selecione se o produto está disponível.' }]}
                        >
                            <Select>
                                <Select.Option value="sim">Sim</Select.Option>
                                <Select.Option value="nao">Não</Select.Option>
                            </Select>
                        </Form.Item>
    
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Atualizar Produto
                            </Button>
                        </Form.Item>
                    </Form>
                );
            case 'deletarPorId':
                return (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={async (values) => {
                            try {
                                const idProdutoDeletar = values.idProdutoDeletar;
                                const messageResult = await fetchDeletarProdutoPorId(idProdutoDeletar);
                                message.success(messageResult);
                                form.resetFields();
                            } catch (error) {
                                message.error('Erro ao deletar produto: ' + error.message);
                            }
                        }}
                    >
                        <Form.Item
                            label="Id do Produto"
                            name="idProdutoDeletar"
                            rules={[{ required: true, message: 'Por favor, insira o id do produto.' }]}
                        >
                            <Input placeholder="Insira o id do produto." />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Deletar Produto
                            </Button>
                        </Form.Item>
                    </Form>
                );
            case 'deletarPorNome':
                return (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={async (values) => {
                            try {
                                const nomeProdutoDeletar = values.nomeProdutoDeletar;
                                const messageResult = await fetchDeletarProdutoPorNome(nomeProdutoDeletar);
                                message.success(messageResult);
                                form.resetFields();
                            } catch (error) {
                                message.error('Erro ao deletar produto: ' + error.message);
                            }
                        }}
                    >
                        <Form.Item
                            label="Nome do Produto"
                            name="nomeProdutoDeletar"
                            rules={[{ required: true, message: 'Por favor, insira o nome do produto.' }]}
                        >
                            <Input placeholder="Insira o nome do produto." />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Deletar Produto
                            </Button>
                        </Form.Item>
                    </Form>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ paddingTop: '20px', paddingLeft: '20px'}}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row justify="center" gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Button type="primary" size="large" onClick={() => showModal('mostrarTodos')} block>
                            Mostrar todos os produtos
                        </Button>
                    </Col>
                </Row>
                <Row justify="center" gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Button type="primary" icon={<SearchOutlined />} size="large" onClick={() => showModal('procurarPorId')} block>
                            Procurar produto por Id
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Button type="primary" icon={<SearchOutlined />} size="large" onClick={() => showModal('procurarPorNome')} block>
                            Procurar produto por Nome
                        </Button>
                    </Col>
                </Row>
                <Row justify="center" gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Button type="default" icon={<PlusOutlined />} size="large" onClick={() => showModal('adicionar')} block>
                            Adicionar produto
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Button type="default" icon={<EditOutlined />} size="large" onClick={() => showModal('atualizarProdutoId')} block>
                            Atualizar produto por Id
                        </Button>
                    </Col>
                </Row>
                <Row justify="center" gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Button icon={<DeleteOutlined />} size="large" onClick={() => showModal('deletarPorId')} block>
                            Deletar produto por Id
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Button icon={<DeleteOutlined />} size="large" onClick={() => showModal('deletarPorNome')} block>
                            Deletar produto por Nome
                        </Button>
                    </Col>
                </Row>
            </Space>

            <Modal
                title="Produtos Boi Saude"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    currentAction !== 'mostrarTodos' && (
                        <Button key="cancel" onClick={handleCancel}>
                            Cancelar
                        </Button>
                    ),        
                ]}>
                {renderModalContent()}
            </Modal>

        </div>
    );
};

export default Botoes_Completos;
