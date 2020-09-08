import React, { Component } from 'react';
import axios from 'axios';
import classes from './Search.module.css';
import TitleResultList from '../TitleResultList/TitleResultList';
import Header from '../../components/Header/Header';
import SelectedMovie from '../../components/SelectedMovie/SelectedMovie'
import PageButtons from '../../components/PageButtons/PageButons';
import Layout from '../../hoc/Layout/Layout';
import SideDrawer from '../../components/UI/SideDrawer/SideDrawer';
import Spinner from '../../components/UI/Spinner/Spinner';

class Search extends Component {

    state = {
        title: 'batman',
        year: '',
        pageNum:0,
        page: 1,
        show: true,
        open: false,
        loading: false,
        secondLoading: false
    };

   componentDidMount () {
        axios.get(`http://www.omdbapi.com/?apikey=9b4df03d&s=${this.state.title}&y=${this.state.year}&page=${this.state.page}`)
        .then(response => {
            let pageNum = 0
            if (response.data.totalResults > 10) {
                 pageNum = Math.ceil(response.data.totalResults / 10);
            }
            this.setState({data: response.data,
            pageNum: pageNum})          
        })
        .catch((error) => console.log(error))

        axios.get(`http://www.omdbapi.com/?apikey=9b4df03d&t=batman begins`)
        .then(response => this.setState({singleMovieData: response.data}))
        .catch(error => console.log(error));
    };
          
    movieTitleHandler = event => {
        this.setState({secondLoading: true})
        axios.get(`http://www.omdbapi.com/?apikey=9b4df03d&t=${event.target.textContent}`)
        .then(response => this.setState({secondLoading: false,
                                    singleMovieData: response.data}))
        .catch(error => {
            this.setState({secondLoading: false})
            alert(` ${error} 
        Sorry, I should made error handling module`)
        });
        this.sideDrawerHandler();
    };

    onSubmitHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true})              
        axios.get(`http://www.omdbapi.com/?apikey=9b4df03d&s=${this.state.title}&y=${this.state.year}&page=${this.state.page}`)
        .then(response => {          
            let pageNum = 0;
            if (response.data.totalResults > 10) {
                 pageNum = Math.ceil(response.data.totalResults / 10);
            };
            
            this.setState({loading: false, 
                            data: response.data,
                            pageNum: pageNum})
        }).catch (error => {
            this.setState({loading: false})
            alert(error)
        });
        this.sideDrawerHandler();
    };

    onTitleChangeHandler = (event) => {
        const newTitle = event.target.value;
        this.setState({title: newTitle});
    };

    onYearChangeHandler = (event) => {
        const newYear = event.target.value;
        this.setState({year: newYear});
    };

    prevPageHandler = () => {
        this.setState(prevState => ({page: prevState.page - 1}))
    };

    nextPageHandler = () => {
        this.setState(prevState => ({page: prevState.page + 1}))
    };

    sideDrawerHandler = () => {
        this.setState(prevstate => ({open: !prevstate.open,
                                    show: !prevstate.show}))
    };

    clearInputHandler = event => {
        event.target.value = '' ;
    };

    componentDidUpdate (prevProps, prevState) {
        if(prevState.page !== this.state.page) {
            axios.get(`http://www.omdbapi.com/?apikey=9b4df03d&s=${this.state.title}&y=${this.state.year}&page=${this.state.page}`)
            .then(response => {
                this.setState({data: response.data})
        }).catch(error => alert(error));
    };
 };
    render () {
        let selectedMovie = <SelectedMovie movie={this.state.singleMovieData}/>
        let titleResultList = <TitleResultList clicked={this.movieTitleHandler} data={this.state.data}/>
        if (this.state.loading) {
            titleResultList = <Spinner />
        };

        if (this.state.secondLoading) {
            selectedMovie = <Spinner />
        };
        return (
            <div className={classes.Search}>
                <Header submit={this.onSubmitHandler} 
                changeTitle={this.onTitleChangeHandler}
                changeYear={this.onYearChangeHandler}
                clear={this.clearInputHandler}/>
               
                <Layout>
                    <div className={classes.Helper2} onClick={this.sideDrawerHandler}><ion-icon name="list-outline"></ion-icon></div>
                        <SideDrawer open={this.state.open} 
                        show={this.state.show} 
                        closed={this.sideDrawerHandler} 
                        clicked={this.movieTitleHandler} 
                        data={this.state.data}
                        nextPage={this.nextPageHandler}
                        prevPage={this.prevPageHandler} 
                        page={this.state.page} 
                        pageNum={this.state.pageNum}/>

                    <div className={classes.Helper}>
                        {titleResultList}
                        <PageButtons nextPage={this.nextPageHandler} prevPage={this.prevPageHandler} page={this.state.page} pageNum={this.state.pageNum}/>
                    </div>                  
                    {selectedMovie}
                </Layout>              
            </div>
        );
    };
};


export default Search;