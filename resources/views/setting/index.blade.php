@extends('layouts.app')

@section('content')
    <div class="row">
        <div class="col-md-12">
            <h2>@lang('Settings')</h2>

            <div class="col-md-8 ">
                <div class="panel panel-default">
                    <div class="panel-heading">@lang('User Settings')</div>

                    <div class="panel-body">
                        <form action="{{url('settings')}}" method="POST" enctype="multipart/form-data">
                            {!! csrf_field() !!}

                            @if (session('status'))
                                <div class="alert alert-success">
                                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;
                                    </button>
                                    {{ session('status') }}
                                </div>
                            @endif

                            <div class="alert alert-info">

                                <strong>@lang('Types and Status')</strong> @lang('Please align the values for status and type with them in your MMEX Client (New Transaction -> Dropdowns Status and Type).')
                            </div>

                            <p class="lang">@lang('Status')</p>
                            @foreach($status as $s)
                                <input type="hidden" name="status_ids[]" value="{{$s->id}}">
                                <input class="form-control" value="{{$s->name}}" name="status_values[]">
                            @endforeach

                            <p class="lang">@lang('Types')</p>
                            @foreach($types as $s)
                                <input type="hidden" name="type_ids[]" value="{{$s->id}}">
                                <input class="form-control" value="{{$s->name}}" name="type_values[]">
                            @endforeach

                            <div class="form-group label-static is-empty">
                                <button type="submit" class="btn btn-primary btn-raised">@lang('Save')</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <h4>@lang('Common')</h4>
                <div class="settings-common">

                    <dl class="dl-horizontal">
                        <dt>App Version</dt>
                        <dd>{{$version}}</dd>
                        <dt>API Version</dt>
                        <dd>{{\App\Services\Mmex\MmexConstants::$api_version}}</dd>
                    </dl>
                </div>

                <h4>@lang('Used Packages')</h4>

                <ul class=list-unstyled>
                    @foreach($packages as $package)
                        <li><a href="https://packagist.org/packages/{{$package["name"]}}"
                               target="_blank">{{$package["name"]}}{{'@'}}{{ $package["version"] }}</a></li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
@stop