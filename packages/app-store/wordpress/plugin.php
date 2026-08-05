<?php
/**
 * Plugin Name:       Slottr
 * Plugin URI:        https://TODO-your-domain.example/apps/wordpress
 * Description:       Embed your Slottr in Wordpress
 * Version:           0.1
 * Author:            TODO_YOUR_NAME
 * Author URI:        https://TODO-your-domain.example
 * License:           MIT
 * License URI:       https://opensource.org/license/mit
 * Text Domain:       calcom-embed
 */

function cal_shortcode( $atts, $content = null) {
global $post;extract(shortcode_atts(array(
'for' => $post->post_title,
), $atts));
if(empty($content)) $content='Embed Slottr';
// TODO: How to reuse embed-snippet export here?
// TODO: replace the hardcoded embed.js origin below with this deployment's own WEBAPP_URL
return '<script>(function (C, A, L){let p=function (a, ar){a.q.push(ar);}; let d=C.document; C.Cal=C.Cal || function (){let cal=C.Cal; let ar=arguments; if (!cal.loaded){cal.ns={}; cal.q=cal.q || []; d.head.appendChild(d.createElement("script")).src=A; cal.loaded=true;}if (ar[0]===L){const api=function (){p(api, arguments);}; const namespace=ar[1]; api.q=api.q || []; typeof namespace==="string" ? (cal.ns[namespace]=api) && p(api, ar) : p(cal, ar); return;}p(cal, ar);};})(window, "https://TODO-your-domain.example/embed.js", "init"); Cal("init") </script> <script>Cal("inline",{calLink: '.$content.'});</script>';
}
add_shortcode('cal', 'cal_shortcode');
