import React, { useState } from 'react';
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

    const renderModalContent = () => {
        switch (currentAction) {
            case 'mostrarTodos':
                return (
                    <List
                        dataSource={products}
                        renderItem={(item) => (
                            <List.Item>
                                <strong>Id: {item.id} - {item.nome}</strong>: Preco de Custo/Venda
                                R${item.precoCusto} - {item.precoVenda} | Quantidade: {item.quantidade}
                            </List.Item>
                        )}
                    />
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
                                        Preço de Custo: R${selectedProduct.precoCusto}
                                        <br />
                                        Preço de Venda: R${selectedProduct.precoVenda}
                                        <br />
                                        Quantidade: {selectedProduct.quantidade}
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

                                        if (retorno) {
                                            setSelectedProduct({
                                                id: retorno.id,
                                                nome: retorno.nome,
                                                precoCusto: retorno.precoCusto,
                                                precoVenda: retorno.precoVenda,
                                                quantidade: retorno.quantidade,
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
                                        Preço de Custo: R${selectedProduct.precoCusto}
                                        <br />
                                        Preço de Venda: R${selectedProduct.precoVenda}
                                        <br />
                                        Quantidade: {selectedProduct.quantidade}
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
                                                precoCusto: retorno.precoCusto,
                                                precoVenda: retorno.precoVenda,
                                                quantidade: retorno.quantidade,
                                            });
                                            message.success('Produto encontrado.');
                                        } else {
                                            setSelectedProduct(null);
                                            message.warning('Produto não encontrado.');
                                        }
                                    } catch (error) {
                                        console.error('Erro', error);
                                        message.error('Erro para achar o produto. Tente novamente.');
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
                                                precoCusto: parseFloat(values.PrecoCusto),
                                                precoVenda: parseFloat(values.PrecoVenda),
                                                quantidade: parseInt(values.quantiaProduto, 10),
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
                                    label="Preço de Custo"
                                    name="PrecoCusto"
                                    rules={[
                                        { required: true, message: 'Por favor, insira o preço de custo do produto.' },
                                        { pattern: /^\d+(\.\d{1,2})?$/, message: 'Por favor, insira um valor válido.' },
                                    ]}
                                >
                                    <Input placeholder="Insira o preço de compra do produto." />
                                </Form.Item>
                                <Form.Item
                                    label="Preço de Venda"
                                    name="PrecoVenda"
                                    rules={[
                                        { required: true, message: 'Por favor, insira o preço de venda do produto.' },
                                        { pattern: /^\d+(\.\d{1,2})?$/, message: 'Por favor, insira um valor válido.' },
                                    ]}
                                >
                                    <Input placeholder="Insira o preço de venda do produto." />
                                </Form.Item>
                                <Form.Item
                                    label="Quantidade"
                                    name="quantiaProduto"
                                    rules={[
                                        { required: true, message: 'Por favor, insira a quantidade do produto.' },
                                        { pattern: /^\d+$/, message: 'A quantidade deve ser um número inteiro.' },
                                    ]}
                                >
                                    <Input placeholder="Insira a quantidade do produto." />
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
                                        precoCusto: parseFloat(values.PrecoCusto),
                                        precoVenda: parseFloat(values.PrecoVenda),
                                        quantidade: parseInt(values.quantiaProduto, 10),
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
                            label="Preço de Custo"
                            name="PrecoCusto"
                            rules={[
                                { required: true, message: 'Por favor, insira o preço de custo do produto.' },
                                { pattern: /^\d+(\.\d{1,2})?$/, message: 'Por favor, insira um valor válido.' },
                            ]}
                        >
                            <Input placeholder="Insira o preço de compra do produto." />
                        </Form.Item>
                        <Form.Item
                            label="Preço de Venda"
                            name="PrecoVenda"
                            rules={[
                                { required: true, message: 'Por favor, insira o preço de venda do produto.' },
                                { pattern: /^\d+(\.\d{1,2})?$/, message: 'Por favor, insira um valor válido.' },
                            ]}
                        >
                            <Input placeholder="Insira o preço de venda do produto." />
                        </Form.Item>
                        <Form.Item
                            label="Quantidade"
                            name="quantiaProduto"
                            rules={[
                                { required: true, message: 'Por favor, insira a quantidade do produto.' },
                                { pattern: /^\d+$/, message: 'A quantidade deve ser um número inteiro.' },
                            ]}
                        >
                            <Input placeholder="Insira a quantidade do produto." />
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
                                    // Obtém o ID do produto do formulário
                                    const idProdutoDeletar = values.idProdutoDeletar;
                
                                    // Chama a função para deletar o produto
                                    const messageResult = await fetchDeletarProdutoPorId(idProdutoDeletar);
                
                                    // Exibe mensagem de sucesso e reseta o formulário
                                    message.success(messageResult);
                                    form.resetFields();
                                } catch (error) {
                                    // Exibe mensagem de erro
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
                return <p>Selecione uma ação válida.</p>;
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
