import React from 'react';
import { Layout, Typography } from 'antd';
import './Cabecalho.css';

const { Title, Text } = Typography;

const Cabecalho = () => {
  return (
    <Layout.Header className="cabecalho">
      <Typography>
        <Title level={1} className="titulo">
          Aba de Produtos
        </Title>
        <Text className="texto">
          Acesso aos Produtos da Boi Saúde
        </Text>
      </Typography>
    </Layout.Header>
  );
};

export default Cabecalho;
