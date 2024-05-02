import './charList.scss';
import MarvelService from "../../services/MarvelService";
import {Component} from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";

class CharList extends Component {

    marvelService = new MarvelService();

    state = {
        charList: [],
        error: false,
        loading: true,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharsListLoaded = (newCharList) => {

        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
                error: true,
                loading: false
            });
    }

    itemRefs = [];
    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();

    }

    renderItems(arr) {
        const items =  arr?.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li
                    className={item.id === this.props.charId ? "char__item char__item_selected" : "char__item"}
                    key={item.id}
                    tabIndex={0}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    className="button button__main button__long"
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}


export default CharList;