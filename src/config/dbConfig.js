module.exports = {
    dialect: process.env.DBdialect,
    host: process.env.DBhost,
    username: process.env.DBusername,
    password: process.env.DBpassword,
    database: process.env.DBdatabase,
    define: {
        timestamps: true,//isso faz com que toda transação no meu bd atualize os campos: created_at e updated_at
        underscored: true,//troca o padrão PascalCase pra separação por: _
    },
};
