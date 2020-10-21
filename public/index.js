const init_data = async () => {
    model({
        state: {
            user_id: page_params.me.user_id,
        },
    });
    await _.fetch_users();
};

$(document).ready(async () => {
    const ws_url =
        'ws://' + window.location.hostname + ':' + page_params.game_port;
    console.info(ws_url);
    const ws = new WebSocket(ws_url);

    ws.onopen = () => {
        console.log('now connected');
    };

    await init_data();
    window.tictactoe.initialize({
        params: page_params.game,
        ws: ws,
    });

    async function redraw_everything() {
        const main_page = await window.main.render(page_params);
        $('#main').html(main_page);
    }

    redraw_everything();
});
