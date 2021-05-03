exports.handler = async () => {
    console.log("Function ran");
    const data = { name: "Kenton", profession: "Programmer" };

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}