import './index.css'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function message(message: string) {
    const message_box = document.getElementById(`message_box`);
    if(!message_box) {
        console.error('Could not find message boxes');
        return;
    }

    if(message.length == 0) {
        message_box.classList.add('hidden');
        return;
    }
    message_box.classList.remove('hidden');
    message_box.textContent = message;
}

function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

function download_zip(event: SubmitEvent) {
    event.preventDefault();

    const player1_name = document.getElementById('player1_name');
    const player2_name = document.getElementById('player2_name');
    if(!player1_name || !player2_name) {
        console.error('Could not find player name inputs');
        return false;
    }

    const player1 = (player1_name as HTMLInputElement).value;
    const player2 = (player2_name as HTMLInputElement).value;

    if(player1.length == 0 || player2.length == 0) {
        message('You need to enter both player names.');
        return false;
    }

    let files = []
    for(let i = 0; i < 3; i++) {
        const file_input = document.getElementById(`game${i+1}_replay`);
        if(!file_input) {
            console.error(`Could not find file input element ${i+1}`);
            return false;
        }
        const input_files = (file_input as HTMLFormElement).files;
        if(!input_files) {
            console.error(`No files for file input element ${i+1}`);
            return false;
        }
        const file = input_files[0];
        if (file) {
            files.push(file);
        } else {
            files.push(null);
        }
    }

    if(files[0] == null || files[1] == null) {
        message('You need to select the first two games.');
        return false;
    }
    if(files[2] == null) {
        message('Adding a third dummy game to the zip.');
        const array = new Uint8Array(getRandomInt(1e5, 3e6));
        //window.crypto.getRandomValues(array);
        files[2] = new Blob([files[0], array]);
    }

    const zip = new JSZip();
    const match_name = `${player1}_vs_${player2}`;

    zip.file(`${match_name}_G1.aoe2record`, files[0]);
    zip.file(`${match_name}_G2.aoe2record`, files[1]);
    zip.file(`${match_name}_G3.aoe2record`, files[2]);    

    zip.generateAsync({type:"blob"})
    .then(function (blob) {
        saveAs(blob, `${match_name}.zip`);
    });

    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('replay_form');
    if(!form) {
        console.error('Could not find form');
        return false;
    }
    form.addEventListener('submit', download_zip);
    for(let i = 0; i < 3; i++) {
        const clear_button = document.getElementById(`game${i+1}_clear`);
        const file_input = document.getElementById(`game${i+1}_replay`);
        if(!clear_button || !file_input) {
            console.error(`Could not find file input controls for file ${i+1}`);
            continue;
        }
        
        clear_button.removeAttribute('disabled');
        clear_button.addEventListener('click', (e) => {
            e.preventDefault();
            (file_input as HTMLInputElement).value = '';
            return false;
        })
    }

    const button_download = document.getElementById('button_download');
    if(!button_download) {
        console.error('Could not find download button');
        return false;
    }
    button_download.removeAttribute('disabled');
}, false);
