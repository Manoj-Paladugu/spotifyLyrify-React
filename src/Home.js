import React, { Component } from 'react';
import './App.css'
import secrets from './secrets'
import SpotifyWebApi from 'spotify-web-api-js';
import cheerio from 'cheerio';
import { Image, DropdownButton, Button,  ButtonGroup, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import request from 'request';
import Form from "react-bootstrap/Form";
const {OAuth2Client} = require('google-auth-library');


const spotifyApi = new SpotifyWebApi();

// const oauth2Client = new google.auth.OAuth2(
//     '642283527300-aq1i587khnmijaenkc1pkaormdnh6opg.apps.googleusercontent.com',
//     'Un2w5BD3IH5lwXM4Bqxm3huI',
//     'http://localhost'
// );
//
// const scopes = [
//     'https://www.googleapis.com/auth/youtube.force-ssl'
// ];



/**
 POST /oauth2/v4/token HTTP/1.1
 Host: www.googleapis.com
 Content-length: 322
 content-type: application/x-www-form-urlencoded
 user-agent: google-oauth-playground
 code=4%2FsAEBxsijedojZnvrmNAm0c2FU4dL3Dc_7ZmSSkbv3IdkkUumq-XATGtMqt0HgHZPQAjNxhgHCYm_lBbDqQYCoao&redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&client_id=642283527300-aq1i587khnmijaenkc1pkaormdnh6opg.apps.googleusercontent.com&client_secret=Un2w5BD3IH5lwXM4Bqxm3huI&scope=&grant_type=authorization_code
 HTTP/1.1 200 OK
 Content-length: 484
 X-xss-protection: 0
 X-content-type-options: nosniff
 Transfer-encoding: chunked
 Vary: Origin, X-Origin, Referer
 Server: scaffolding on HTTPServer2
 -content-encoding: gzip
 Cache-control: private
 Date: Sat, 12 Oct 2019 11:03:15 GMT
 X-frame-options: SAMEORIGIN
 Alt-svc: quic=":443"; ma=2592000; v="46,43",h3-Q048=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000
 Content-type: application/json; charset=utf-8
 {
  "access_token": "ya29.Il-bB00LxoaOYkDm2x1vLCcdTzhnPfhLv5GGWIvYi4f8SNMOkA80OQmHEzWN49nTmDo6nK3s7siIw6hbOwZa2rr-XfzWYaiNgxOzWMM2xL4TI1uB2w70-9eMIqVjE0iafg",
  "scope": "https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "1//041uCt9bxsVAtCgYIARAAGAQSNwF-L9IrAtUQval9_Dg8r4t4ftO6g2tCGcxhVXde95eUSVfnSqJW1L45OqZMJV9_QHRv2wy3l9g"
}
 *
 */
class Home extends Component {
    constructor(){
        super();
        const params = this.getHashParams();
        this.authenticate();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: !!token,
            isPlaying : false,
            nowPlaying: { name: '', albumArt: '', artist : ''}
        }
        console.log(token)
        window.location.hash = "";
    }
    authenticate() {
        console.log('yeeters')
        fetch('https://cors-anywhere.herokuapp.com/' + `https://accounts.google.com/o/oauth2/v2/auth?client_id=642283527300-aq1i587khnmijaenkc1pkaormdnh6opg.apps.googleusercontent.com&response_type=code&scope=https://www.googleapis.com/auth/youtube.force-ssl&include_granted_scopes=true&redirect_uri=http://localhost&access_type=offline`)
            .then(
                (json) => {
                    console.log(json);
                    return json
                }).then(() => {console.log(this.getHashParams()); this.getCaptions()})
    }

    getCaptions() {
        console.log('yeeters')
        fetch('https://cors-anywhere.herokuapp.com/' + `https://www.googleapis.com/youtube/v3/captions/8S2GjnNfitU5HHoLyTeLxq_W1dP29YRFC8E8vFBUtws=?key=AIzaSyBg20mTVJt_ZjNCTpdY_AVlKUkIVbagXdg&part=snippet&videoId=vtY8pM-H65c`,
            {headers :{Authorization : 'Bearer ya29.ImCbB7l3SVGgz4owwSbHVZAlrpJFrPKykNw43FgXALn6xZ3MMBDXopmPhZxjoOMWycmhWzIy8KQcYB4NNRdvukBoRlb48z3JX_wnB6VXcXc_R6ZlEyr_722FDUqhoP6S5MY'}})
            .then(
                (response) => {
                    return response.text();
                }).then( (response) => console.log(response))
    }

    getHashParams() {
        let hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q);
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }
    getNowPlaying(){
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                if (response.is_playing) {
                    this.setState({
                        isPlaying : response.is_playing,
                        nowPlaying: {
                            name: response.item.name,
                            albumArt: response.item.album.images[0].url,
                            artist : response.item.artists[0].name
                        }
                    });
                }
                console.log(response)
            })
            .then( () => {
                if (this.state.isPlaying) {
                    this.searchSong();
                }
                
            })
    }

    searchSong() {
        fetch(`https://api.genius.com/search?q=${this.state.nowPlaying.artist} ${this.state.nowPlaying.name}&access_token=${secrets.genius_token}`)
            .then(
                (json) => {
                    return json.json()
                }).then(
                    (response) => {
                        this.setState({
                            nowPlaying: {
                                ...this.state.nowPlaying,
                                songId: response.response.hits[0].result.id
                            }
                        });
                        return response.response.hits[0].result.url
                    }).then((url) => {this.scrapSong(url)})
    }

    scrapSong(url) {
        console.log(url);
        console.log(this.state.nowPlaying);
        //fix this hacky fix xd
        request('https://cors-anywhere.herokuapp.com/' + url,function(err,res,body) {
            let html = cheerio.load(body);
            let scrapedLyrics = html('.lyrics').text().split('\n');

            // scrapedLyrics.replace("\n","<br>\n");
            this.setState({
                nowPlaying: {
                    ...this.state.nowPlaying,
                    scrapedLyrics: scrapedLyrics
                }
            });
            console.log(this.state.nowPlaying)
        }.bind(this))
    }
    getSong() {
        console.log(secrets.genius_token);
        fetch(`https://api.genius.com/songs/${this.state.nowPlaying.songId}?access_token=${secrets.genius_token}`)
            .then(
                (response) => {
                    console.log('success');
                    return response.json()
                }).then(response => console.log(response.response))
    }

    generateLyrics = () => {
        let contents = [];
        let lyricsLst = this.state.nowPlaying.scrapedLyrics;
        if (lyricsLst !== undefined) {
            for (let i = 0; i < lyricsLst.length; i++) {
                contents.push(<p key={i}>{lyricsLst[i]}</p>)
            }
            return contents
        }
    };

    render() {
        return (
            <div className="App">

                <div className="container">
                    { this.state.isPlaying &&
                        <div className="row">
                            <div className="col">
                                    <div className="now_playing">

                                        <div className='row justify-content-center'>
                                            <Image src={this.state.nowPlaying.albumArt} style={{ height: 150 }} alt='' />
                                        </div>

                                        <div className='row justify-content-center'>
                                            <strong> {this.state.nowPlaying.name} </strong>
                                        </div>

                                        <div className='row justify-content-center'>
                                            {this.state.nowPlaying.artist}
                                        </div>

                                        <div className='row justify-content-center'>
                                            { this.state.loggedIn &&
                                            <button className="btn btn-info"  onClick={() => this.getNowPlaying()}>
                                                Fetch Now Playing
                                            </button>
                                            }
                                        </div>
                                    </div>
                            </div>
                            <div className="jumbotron col">
                                <Form className="row justify-content-center">
                                    <Form.Check
                                        type="switch"
                                        id="autoScrollSwitch"
                                        label="auto-scroll"
                                        className="col"
                                    />
                                    <DropdownButton id="dropdown-basic-button" title="YouTube">
                                        <Dropdown.Item href="#/action-1">Eng</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">French</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Maori</Dropdown.Item>
                                    </DropdownButton>
                                </Form>
                                <div className="flex-row">
                                    {this.generateLyrics()}
                                </div>
                            </div>
                        </div>
                    }
                    {  !this.state.isPlaying &&

                        <div style={{marginTop: "37%"}}>
                            { this.state.loggedIn &&
                            <button className="btn btn-info"  onClick={() => this.getNowPlaying()}>
                                <strong>Fetch Lyrics</strong>
                            </button>
                            }
                        </div>

                    }

                </div>

            </div>
        );
    }
}
export default Home;